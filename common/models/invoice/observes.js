"use strict";

const util = require("util");
const async = require("async");

module.exports = (Invoice) => {
  Invoice.observe('after save', function(ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let paid = ctx.options.paid;
    let instanceOrData = ctx.instance || ctx.data;
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    if (instance.status === Invoice.Status.paid && paid) {
      Invoice.emit(Invoice.paidEvent, ctx);
    }

    next();
  });
};