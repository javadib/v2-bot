"use strict";

module.exports = function(Product) {

  Product.observe('loaded', function(ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    if (data && data.hasOwnProperty('totalPrice')) {
      let product = new Product(data);
      let payablePrice = product.getPayablePrice();
      data.payablePrice = payablePrice;
    }

    next();
  });

  Product.observe('before save', function(ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    if (isNewInstance) {
      instance.payablePrice = undefined;
    }

    next();
  });

  Product.observe('after save', function(ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    if (isNewInstance) {
      instance.payablePrice = instance.getPayablePrice();
    }

    next();
  });

};