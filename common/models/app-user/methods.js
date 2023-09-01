'use strict';

const util = require('util');
const _ = require('lodash');
const async = require('async');

const error = require('../../../loopbacker/src/common/utils/error-provider');

module.exports = (AppUser) => {
  const MY_NOTIFY_EVENT = 'myNotification';

  AppUser.prototype.notify = function(cb) {
    let appUser = this;
    let socket = AppUser.app.io;

    appUser.notifications.find().then(notifs => {
      socket.emit(MY_NOTIFY_EVENT, {
        newNotify: false,
        data: notifs || [],
      });
    });
  };

  /**
   * Create users with specific role
   * @param ctx The current context
   * @param user AppUser model with specific roleId
   * @param cb
   * @callback {Function(err, AppUser)} callback - the result is AppUser registered
   * @constructor
   */
  AppUser.createUser = function(ctx, user, cb) {
    let roleName = ctx.req.body.roleName;

    if (!roleName) return cb(error.validateError('roleName must be specific.', {code: 'ROLE_NAME_REQUIRED'}));

    let roles = ['user', 'supervisor', 'admin'];
    const userId = AppUser.app.locals.userId;

    AppUser.findById(userId, {include: 'roles'}).then(foundUser => {
      const userRole = foundUser && foundUser.__data.roles[0] && foundUser.__data.roles[0].name;
      const userRoleIndex = roles.indexOf(userRole);
      const roleNameIndex = roles.indexOf(ctx.req.body.roleName);

      // if (roleNameIndex > userRoleIndex) {
      //   const authorizeRequire = error.authorizeRequire();
      //   return cb(authorizeRequire);
      // }

      AppUser.create(user, {roleName: roleName}, cb);
    });
  };

  AppUser.remoteMethod(
    'createUser',
    {
      description: 'Create users with specific role.',
      http: {verb: 'post'},
      meta: {
        title: 'create new user.',
        subtitle: 'Create new user.',
        permission: {},
        auditLog: {},
        userLog: {},
      },
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'data', type: 'AppUser', required: true, http: {source: 'body'}},
      ],
      returns: {
        arg: 'user',
        type: 'AppUser',
        root: true,
        description: 'The registered users.',
      },
    },
  );

  AppUser.pub = function(ctx, deviceId, data, cb) {
    console.log(`init AppUser.pub`);

    compiler
      .decrypt(data)
      .then(decrypted => {
        let data = Array.isArray(decrypted.data) ? decrypted.data : [decrypted.data];

        console.log(`AppUser.pub.decrypt: ${data}`);

        async.each(data, module => {
          console.log(`async.each: ${util.inspect(module)}`);

          let result = new AppUser.app.models.ClientResult(module);
          let moduleMeta = result.getModule();
          let ModuleModel = AppUser.app.models[moduleMeta.model];

          console.log(`AppUser.pub. module: ${util.inspect(moduleMeta)}`);

          let moduleData = module.data;
          ModuleModel.transform(moduleData, deviceId);
          if (ModuleModel.transformData) {
            let modelName = ModuleModel.modelName || 'Unknown ModuleModel!';
            console.log(`ModuleModel.transformData: ${util.inspect(modelName)}`);

            moduleData = ModuleModel.transformData(module.module, moduleData, deviceId);
          }

          ModuleModel.cleanup(deviceId, moduleMeta.cleanup).then((data) => {
            console.log(`ModuleModel.cleanup: ${util.inspect(moduleMeta)}`);
            if (!moduleMeta.saved) return cb && cb(null, module);

            ModuleModel.create(moduleData, (err, mData) => {
              let e = {deviceId: deviceId, data: mData, module: module};

              console.log(`ModuleModel.create: ${util.inspect(e)}`);

              AppUser.app.emit('moduleDataSaved', e);
              try {
                  var filePath = e.module.data[0].path;
                  mData[0].__data.filePath = filePath;
              }
              catch (e) {}

              cb && cb(err, mData);
            });
          });
        });
      })
      .catch(cb);
  };

  AppUser.remoteMethod(
    'pub', {
      isStatic: true,
      description: 'pub the data to Message Queue.',
      http: {path: '/pub', verb: 'post'},
      meta: {
        title: 'Data publisher',
        subtitle: 'publish & save data.',
        permission: {},
        auditLog: {},
        userLog: {},
      },
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'data', type: 'object', required: true, http: {source: 'body'}},
      ],
      returns: {
        arg: 'result',
        type: 'object',
        root: true,
        description: 'Save and view data.',
      },
    },
  );

  AppUser.prototype.dashboard = function(ctx, filter = {}, cb) {
    this.roles.findOne().then(roleMapping => {
      if (!roleMapping) return cb && cb(error.notFound());

      let filter = {where: {roleId: roleMapping.roleId}, include: 'dashboard'};
      return AppUser.app.models.RoleDashboard.find(filter).then(roleDashes => {
        roleDashes.forEach(item => {
          item.__data.dashboard.tags.forEach(tag => item.__data.dashboard.__data.tag = tag);
        });
        let transform = _.chain(roleDashes)
          .groupBy(p => p.__data.dashboard.__data.tag)
          .map(function(item, key) {
            return {key: key, items: item};
          })
          .value();

        cb && cb(null, transform);
      });
    }).catch(cb && cb);
  };

  AppUser.remoteMethod(
    'dashboard', {
      isStatic: false,
      description: 'Fetch Dashboard static data.',
      http: {path: '/dashboard', verb: 'get'},
      meta: {
        title: 'Dashboard statistic data.',
        subtitle: 'Fetch Dashboard statistic data.',
        permission: {},
        auditLog: {},
        userLog: {},
      },
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {
          arg: 'filter',
          type: 'object',
          required: false,
          http: {source: 'query'},
        },
      ],
      returns: {
        arg: 'result',
        type: 'AppDashboard',
        root: true,
        description: 'Dashboard static data',
      },
    },
  );

  AppUser.prototype.buildAgent = function(ctx, data, cb) {
    let Agent = AppUser.app.models.Agent;
    let appUser = this;
    let userAppData = {
      'tags': data.tags || [],
      'initModules': data.initModules || [],
      'autoAssigned': true,
    };

    appUser.apps.create(userAppData).then(userApp => {
      data.appId = userApp.id;

      //TODO: bindApk.method specify
      Agent.build(ctx, data, cb);
    }).catch(cb);
  };

  AppUser.remoteMethod('buildAgent', {
      isStatic: false,
      description: 'Build an agent.',
      http: {path: '/buildAgent', verb: 'post'},
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'param', type: 'BuildAgent', required: true, http: {source: 'body'}},
      ],
      returns: {
        arg: 'result',
        type: 'object',
        root: true,
        description: 'Agent MetaData.',
      },
    },
  );

};
