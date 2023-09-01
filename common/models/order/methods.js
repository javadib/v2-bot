'use strict';

const async = require('async');
const url = require('url');
const ejs = require('ejs');
const {v4: uuidv4} = require('uuid');

const error = require('../../../loopbacker/common/utils/error-provider');

module.exports = (Order) => {

  function add(a, b) {
    return a + b;
  }

  Order.prototype.confirmOrderEmailBody = function(cb) {
    let order = this;

    return ejs.renderFile('./server/templates/emails/invoice.ejs', {order: order}, cb);
  };

  Order.prototype.confirmOrderSmsText = function() {
    let order = this;
    let msg = `مشتری گرامی سفارش شما با کد پیگیری زیر با موفقیت ثبت شد:
${order.trackingCode}
میتوانید وضعیت سفارش خود را از طریق اپلیکیشن پیگیری نمایید`;

    return msg;
  };

  Order.prototype.processStatus = function(cb) {
    let status = this.lastStatus;
    let err = error.validateError('مهلت استفاده از کد تخفیف برای این سفارش گذشته است.');

    return status > Order.Status.unpaid ?
      cb && cb(err) : cb && cb(null, {status: true});
  };

  Order.prototype.updateStatus = function(status, options, cb) {
    return this.updateAttributes({lastStatus: status}, options, cb);
  };

  Order.prototype.payCallbackUrl = function() {
    const order = this;

    const callbackUrl = url.resolve(
      Order.app.getBaseUrl(), `/Orders/${order.id.toString()}/verify`,
    );

    return callbackUrl;
  };

  Order.prototype.doConfirmOrder = function(credit, payGateway, options = {}, cb) {
    let order = this;
    const Invoice = Order.app.models.Invoice;
    const ConfirmResult = Order.app.models.ConfirmResult;

    if (credit >= order.__data.payablePrice) {
      let data = {
        description: `پرداخت از اعتبار`,
        canMoneyBack: false,
      };

      return order.updateStatus(Order.Status.paid)
        .then(order => Invoice.create({
          'totalPrice': order.__data.payablePrice,
          'payPrice': 0,
          'creditPrice': order.__data.payablePrice,
          'deleteInvoice': false,
          'userId': order.userId,
          'gatewayId': payGateway.id,
          'orderId': order.id,
        })).then(p => order.expensePay(order.__data.payablePrice,
          data, {canReview: true}))
        .then(payment => cb && cb(null, ConfirmResult.paid(order))
          .catch(cb));
    }

    let payPrice = order.__data.payablePrice - credit;
    Invoice.create({
      'uid': uuidv4(),
      'totalPrice': order.__data.payablePrice,
      'payPrice': payPrice,
      'creditPrice': credit,
      'deleteInvoice': false,
      'orderId': order.id,
      'userId': order.userId,
      'storeId': order.storeId,
      'gatewayId': payGateway.id,
    }).then(invoice => {
      let data = {
        amount: payPrice,
        callbackUrl: invoice.payCallbackUrl(),
        options: options.payment || {},
      };

      return payGateway.requestUrl(data);
    })
      .then(data => cb && cb(null, ConfirmResult.payUrl(order, data.url)))
      .catch(cb);
  };

  Order.prototype.incomePay = function(price, data, options = {}, cb) {
    let order = this;
    let payment = {
      totalPrice: price,
      payType: 0, //{income =0, expense = 1}
      payMethod: data.hasOwnProperty('payMethod') ? data.payMethod : 5, //SYSTEM
      reference: data.RefID || data.reference,
      canMoneyBack: data.canMoneyBack,
      description: data.description,
      userId: order.userId,
      storeId: order.storeId,
      gatewayId: order.gatewayId,
      status: true,
    };

    return order.payments.create(payment, options, cb);
  };

  Order.prototype.expensePay = function(price, data, options = {}, cb) {
    let order = this;
    let payment = {
      totalPrice: price,
      payType: 1, //{income =0, expense = 1}
      payMethod: data.hasOwnProperty('payMethod') ? data.payMethod : 5, //SYSTEM
      reference: data.RefID || data.reference,
      description: data.description,
      canMoneyBack: data.canMoneyBack || false,
      userId: order.userId,
      storeId: order.storeId,
      gatewayId: order.gatewayId,
      status: true,
    };

    return order.payments.create(payment, options, cb);
  };

  Order.prototype.saveDiscountPay = function(reference, description, cb) {
    let order = this;
    let Payment = Order.app.models.Payment;

    let desc = `واریز مبلغ کوپن`;
    let incomePay = {
      totalPrice: order.discountPrice,
      payType: 0, //{income =0, expense = 1}
      payMethod: 5, //SYSTEM
      reference: reference || order.couponId,
      description: description || desc,
      canMoneyBack: false,
      userId: order.userId,
      storeId: order.storeId,
      gatewayId: order.gatewayId,
      status: true,
    };

    let expenseData = {
      payType: 1,
      payMethod: 5,
      description: `برداشت مبلغ کوپن`,
    };
    let expensePay = Object.assign(expenseData, incomePay);

    let q = {where: {and: [{couponId: order.couponId}, {orderId: order.id}]}};
    return Payment.findOrCreate(q, [incomePay, expensePay], {canReview: false}, cb);
  };

  Order.prototype.calcPayments = function() {
    let order = this;

    let payments = (order.__data && order.__data.payments) || [];
    let incomes  = payments.filter(p => p.payType === 0 && p.status === true).map(p => p.totalPrice).reduce(add, 0);
    let expenses = payments.filter(p => p.payType === 1 && p.status === true).map(p => p.totalPrice).reduce(add, 0);
    let balance = (incomes - expenses);

    return Promise.resolve({
      balance: balance,
      incomes: incomes,
      expenses: expenses,
    });
  };

  Order.prototype.moneyBack = function(price, description, cb) {
    let order = this;

    return order.payment.create({
      totalPrice: price,
      payType: 0, //{income =0, expense = 1}
      payMethod: 5, //SYSTEM
      reference: order.trackingCode,
      description: description,
      userId: order.userId,
      status: true,
    }, cb);
  };

  Order.prototype.cancelOrder = function(moneyBack = true, description, options = {}, cb) {
    let order = this;

    order.updateAttributes({lastStatus: Order.Status.canceled})
      .then(async data => {
        let calcPayments = await order.calcPayments();
        let price = calcPayments.incomes;

        if (moneyBack && price > 0) {
          order.moneyBack(price, description);
        }

        Order.emit('order_canceled', {
          order: data,
          payment: {
            price: price,
            moneyBack: moneyBack,
            description: description,
          },
        });

        return cb && cb(null, data);
      })
      .catch(cb && cb);
  };

  Order.prototype.applyCoupon = function(param, cb) {
    let order = this;
    let couponCode = param.couponCode || 'UNK-null';

    order.processStatus((err, data) => {
      if (err) return cb && cb(err);

      let pattern = new RegExp(`^${couponCode}$`, 'i');
      Order.app.models.Coupon.findOne({where: {code: pattern}}).then(coupon => {
        if (!coupon) return cb && cb(error.notFound('این کوپن نامعتبر است.'));

        coupon.calcDiscountPrice(order, coupon.usageCount, function(err, value) {
          if (err) return cb && cb(err);

          let payablePrice = order.totalPrice - value;
          let updateDate = {
            discountPrice: value,
            couponId: coupon.id,
            payablePrice: payablePrice,
            // payablePriceTitle: Number(payablePrice).toLocaleString(),
          };
          return order.updateAttributes(updateDate, cb);
        });

      });

    });

  };

  Order.remoteMethod(
    'applyCoupon', {
      isStatic: false,
      description: 'Apply Coupon code.',
      http: {path: '/applyCoupon', verb: 'post'},
      accepts: [
        {arg: 'param', type: 'object', required: false, http: {source: 'body'}},
      ],
      returns: {
        arg: 'result',
        type: 'Order',
        root: true,
        description: 'New order prices.',
      },
    },
  );

};
