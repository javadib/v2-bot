"use strict";

module.exports = function(Product) {

  Product.prototype.getPayablePrice = function() {
    let product = this;

    let payablePrice = product.discountedPrice || product.totalPrice;

    return payablePrice;
  };

  Product.prototype.mapTo = (details) => {
    let product = this;

    details.productId = product.id;
    details.unitPrice = product.totalPrice;
    details.totalPrice = product.payablePrice;

    return details;
  }

};
