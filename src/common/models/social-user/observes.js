'use strict';

module.exports = (SocialUser) => {
  SocialUser.observe('after save', function (ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instanceOrData = ctx.instance || ctx.data;
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    if (!instanceOrData.lastCommand) {
      instanceOrData.session.destroy();
    }

    next();
  });
};
