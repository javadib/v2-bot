'use strict';

module.exports = function(OrderParameter) {

  OrderParameter.setter.couponCode = function (value) {
   this.$couponCode = value.toUpperCase();
  }
};
