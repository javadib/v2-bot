'use strict';

module.exports = function(OrderDetail) {

  OrderDetail.getter.totalPrice = function () {
    let instance = this;
    let total = (instance.unitPrice * instance.quantity);

    total -= total * instance.discount / 100;

    return total;
  };
  
  OrderDetail.prototype.updateFrom = function(product) {
    let details = this;

    details.productId = product.id;
    details.unitPrice = product.discountedPrice || product.totalPrice;
    // details.discount = product.discount || 0;
    // details.totalPrice = product.payablePrice;

    return details;
  };

};
