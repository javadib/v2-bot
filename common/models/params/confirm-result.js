'use strict';

module.exports = function(ConfirmResult) {
  ConfirmResult.paid = function(order) {
    let statusTitle = ConfirmResult.app.models.Order.statusTitle[order.lastStatus];

    return {
      "orderId": order.id,
      "lastStatus": order.lastStatus,
      "lastStatusTitle": statusTitle,
      "paymentUrl": undefined,
      "paid": true
    }
  }

  ConfirmResult.payUrl = function(order, callbackUrl) {
    let statusTitle = ConfirmResult.app.models.Order.statusTitle[order.lastStatus];

    return {
      "orderId": order.orderId,
      "lastStatus": order.lastStatus,
      "lastStatusTitle": statusTitle,
      "paymentUrl": callbackUrl,
      "paid": false
    }
  }
};
