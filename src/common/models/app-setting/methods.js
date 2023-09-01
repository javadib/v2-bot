'use strict';

const async = require('async');

module.exports = (AppSetting) => {

  AppSetting.makeRestoreTask = function(settings = []) {
    return settings.map(setting => {
      return function(callback) {
        setting.updateAttributes({value: setting.defaultValue}, callback);
      };
    });
  };

  AppSetting.makeChangesTask = function(data, settings, options = {}) {
    let task = [];

    data.filter(p => p.__data.hasOwnProperty('value'))
      .forEach(item => {
        let setting = settings.find(p => p.__data.id.toString() === item.__data.id.toString());

        task.push(function(callback) {
          let value = options.restore ? setting.defaultValue : item.__data.value;

          setting.updateAttributes({value: value}, callback);
        });
      });

    return task;
  };

  AppSetting.restoreToDefault = function(ctx, data, options = {}, cb) {
    options.restore = true;

    AppSetting.saveChanges(ctx, data, options, cb && cb);
  };

  AppSetting.remoteMethod(
    'restoreToDefault', {
      isStatic: true,
      description: 'Restore to default value.',
      http: {'path': '/restoreToDefault', verb: 'post'},
      meta: {
        title: 'Restore default.',
        permission: {},
        auditLog: {},
        userLog: {},
        subtitle: 'Setting restore to default.',
      },
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {
          arg: 'data',
          type: ['AppSetting'],
          required: true,
          http: {source: 'body'},
        },
        {arg: 'options', type: 'object', http: {source: 'query'}},
      ],
      returns: {
        arg: 'result',
        type: AppSetting,
        root: true,
        description: 'Return affected settings',
      },
    },
  );

  AppSetting.saveChanges = function(ctx, data = [], options = {}, cb) {
    let {restoreAll = false} = options;
    let ids = data.map(p => p.id);
    let filter = restoreAll ? {} : {where: {id: {inq: ids}}};

    AppSetting.find(filter).then(settings => {
      let task = restoreAll ?
        AppSetting.makeRestoreTask(settings) :
        AppSetting.makeChangesTask(data, settings, options);

      async.parallel(task, (err, result) => {
        if (err) return cb(err);

        return cb && cb(null, result);
      });
    });
  };

  AppSetting.remoteMethod(
    'saveChanges', {
      isStatic: true,
      description: 'Save Changes for all items.',
      http: {path: '/saveChanges', verb: 'post'},
      meta: {
        subtitle: 'Save new Settings.',
        title: 'Save Settings',
        permission: {},
        auditLog: {},
        userLog: {}
      },
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {
          arg: 'data',
          type: ['AppSetting'],
          required: true,
          http: {source: 'body'},
        },
        {arg: 'options', type: 'object', http: {source: 'query'}},
      ],
      returns: {
        arg: 'result',
        type: [AppSetting],
        root: true,
        description: 'Save All changes.',
      },
    },
  );

};