"use strict";

module.exports = (Payment) => {

  Payment.observe('before save', function(ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instanceOrData = ctx.instance || ctx.data;
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    instanceOrData.canMoneyBack = instanceOrData.payType === 1 ? false :
      instanceOrData.canMoneyBack;

    next();
  });

  Payment.observe('after save', function (ctx, next) {
    let payment = ctx.instance || ctx.data;
    let canReview = ctx.options.canReview === true;
    let orderId = payment.orderId;

    if (payment) {
      if (payment.status === true && orderId && canReview) {

        Payment.emit(Payment.reviewEvent, ctx);
      }
    }

    next();
  });

};
