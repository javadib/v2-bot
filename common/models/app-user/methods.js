'use strict';

const util = require('util');
const _ = require('lodash');
const async = require('async');

module.exports = (AppUser) => {
  const MY_NOTIFY_EVENT = 'myNotification';
  const error = AppUser.app.errorProvider();


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

};
