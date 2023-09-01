'use strict';

const _ = require('lodash');

module.exports = function(app) {
  app.on('remoteCalled', async e => {
    let ctx = e.ctx;
    let req = ctx.req;
    let result = ctx.result;
    let token = req.accessToken || ctx.accessToken;
    let method = ctx.method || (req.app && req.app.method) ||
      (req.remotingContext && req.remotingContext.method);

    let logActivateEnable = app.get('LOG_ACTIVATE_ENABLE');
    if (logActivateEnable === false) return;

    if (!method) return;

    let methodMeta = method.meta;
    let operation = method && method.name;
    let modelName = method && method.sharedClass.name;
    let Model = app.models[modelName || ''];
    let description = (methodMeta && methodMeta.title) || method.description;
    let whitelistMethods = ["authenticate", "logWithCode", "requestCode", "login"];

    if (methodMeta && !methodMeta.userLog) return;

    if (!token && whitelistMethods.indexOf(method.name) < 0) return;

    let modelLogActivate = Model && Model.definition.settings.logActivate === true;
    if (!modelLogActivate) return;

    const user = await token.user.get();

    if (!user || !user.logActivate) return;

    user.activities.create({
      'model': modelName,
      'modelId': 'string',
      'operation': operation,
      'user': user && user.username,
      'userIp': app.locals.userIp || app.get('userIp'),
      'success': result.success,
      'description': description,
    });
  });
};
