"use strict";

module.exports = (Ticket) => {

  Ticket.observe('before save', function (ctx, next) {
    var model = ctx.instance || ctx.data;

    if (ctx.isNewInstance) {
      model.lastStatus = 1;
    }

    next();
  });


  Ticket.observe('after save', function(ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    if (isNewInstance) {
      instance.comments.create({
        "description": instance.description,
        "userReplied": true,
        "userId": instance.userId
      })
    }

    next();
  });

};
