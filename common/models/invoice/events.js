'use strict';

const async = require('async');

module.exports = (Invoice) => {
  function updateOrderStatus(order) {
    let Order = Invoice.app.models.Order;

    let options = {paidDate: new Date()}; // prefer save to orderHistory
    order.updateStatus(Order.Status.paid, options).then(instance => {
      Order.emit(Order.paidEvent, {order: instance});
    });
  }

  Invoice.on(Invoice.paidEvent, async(ctx) => {
    let invoice = ctx.instance;
    let orderId = invoice && invoice.orderId;
    let order = (invoice.__data.order || ctx.options.order) ||
      await invoice.order.getAsync();

    if (!order) {
      //TODO: notif to admin!
      return console.log(`${Invoice.paidEvent}: oh! order ${orderId} not found!`);
    }

    let orderPay = await order.calcPayments();
    if (order.payablePrice > orderPay.expenses) {
      //TODO: False Positive! notif to admin!
    }

    if (invoice.creditPrice > 0) {
      await order.expensePay(invoice.creditPrice,
        {reference: invoice.id, payMethod: 1});
    }

    if (invoice.payPrice > 0) {
      let data = {reference: invoice.id, payMethod: 0, canMoneyBack: true};
      order.incomePay(invoice.payPrice, data)
        .then(order.expensePay(invoice.payPrice, data, {canReview: true}))
        .then(_ => updateOrderStatus(order))
        .catch(console.error); // should: push to admin && issue
    }
  });
};
