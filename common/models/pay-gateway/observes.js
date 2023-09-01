"use strict";

module.exports = function(PayGateway) {
  require('./methods')(PayGateway);

  PayGateway.observe('access', function (ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true || (ctx.instance);

    if (instance) {
      instance.iconUrl = instance.getIconUrl();
    }

    next();
  });

};