'use strict';

const async = require('async');

module.exports = (Order) => {
  Order.emitCreated = function(e) {
    let ctx = e.ctx;
    let options = ctx.options || {};
    let instance = ctx.instance || ctx.currentInstance;

    // save details
    let details = options.orderDetails || [];
    if (details.length > 0) {

      instance.details.create(details)
        .then(data => L(`Save ${details.length} item to order.`))
        .catch(err => E(`Save details in options: ${err}`));
    }
  };

  Order.emitUpdated = function(e) {
    let ctx = e.ctx;
  };

  Order.emitDeleted = function(e) {
    let ctx = e.ctx;
  };

  Order.on(Order.paidEvent, async(e) => {
    let app = Order.app;
    let order = e.order;
    let AppUser = app.models.AppUser;
    let AppSetting = app.models.AppSetting;

    // Push to operators
    let subscriberIds = await AppSetting.newOrderNotifToOperators();
    let expertUsers = await AppUser.findByIds(subscriberIds.value);

    async.each(expertUsers, user => {
      user.pushNewOrderMessage(order)
        .then(data => console.log(`Message sent to ${user.fullName}`))
        .catch(err => console.error(`Error in sent Message: ${err}`));
    }, console.log);

    //Push message to user
    let smsText = order.confirmOrderSmsText();
    let user = order.__data.user || await order.user.getAsync();
    order.__data.user = user;

    user.sendSms(smsText);

    order.confirmOrderEmailBody((err, body) => {
      user.sendEmail('تایید سفارش', body, console.log);
    });

    //update coupon usage
    order.coupon && order.coupon.getAsync()
      .then(coupon => {
        if (!coupon) return console.log(`coupon not found for orderId: ${order.id}`);

        coupon.updateUsage(1);
      })
      .catch(err => `Error in updateUsage func: ${console.warn(err)}`);
  });
};
