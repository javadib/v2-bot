"use strict";

const util = require("util");
const async = require("async");

const voucher_codes = require("voucher-code-generator");
const error = require('../../../loopbacker/common/utils/error-provider');

module.exports = (Order) => {
  const ORDER_PREFIX_VALUE = 'MLV';
  const ORDER_LENGTH_GENERATE_CODE = 8;
  const ORDER_MAX_COUNT_GENERATE_CODE = 20;

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
  };


  Order.observe('loaded', function (ctx, next) {
    let instance = ctx.instance;
    let options = ctx.options || {};
    let settings = Order.definition.settings;

    if (instance) {
      if (settings && settings.showOrderStatus) {
        instance.orderStatus = Order.getAllStatus(["-1", "1"]);
      }
    }


    next();
  });

  Order.observe('before save', function (ctx, next) {
    let orderModel = ctx.instance || ctx.data;

    let codes = voucher_codes.generate({
      prefix: ORDER_PREFIX_VALUE + '-',
      length: ORDER_LENGTH_GENERATE_CODE,
      count: ORDER_MAX_COUNT_GENERATE_CODE,
      charset: '0123456789',
      // charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });

    let tasks = {};
    if (ctx.isNewInstance) {
      tasks.trackCodes = function (cb) {
        Order.find({where: {code: {inq: codes}}, fields: ['code']}, cb);
      }
    }

    async.parallel(tasks, function (err, results) {
      if (err) return next(err);

      if (ctx.isNewInstance) {
        let trackCodes = results.trackCodes;
        let diff = codes.diff(trackCodes);

        if (diff.length <= 0) {
          let msg = util.format(error.codes.OBJECT_NOT_FOUND, 'هیچ کد یکتایی');

          return next(error.validateError(msg + ' دوباره امتحان کنید.'));
        }

        orderModel.trackingCode = diff[0];
      }

      const couponModel = ctx.options.coupon;
      const usageCount = ctx.options.usageCount;

      if (!couponModel) return next();

      couponModel.calcDiscountPrice(orderModel, usageCount, function (err, value) {
        if (!err) {
          orderModel.discountPrice = value;
          orderModel.couponId = couponModel.id;
        }

        next();
      });

    });

  });

  Order.observe('after save', function(ctx, next) {
    let options = ctx.options || {};
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    let details = options.orderDetails || [];
    if (isNewInstance && details.length > 0) {
      instance.__data.details = details; // show to method caller
    }

    next();
  });
};
