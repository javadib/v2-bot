'use strict';

const app = require('../../../server/server');

const failView = 'payments/payment_fail';
const successView = 'payments/payment_success';

module.exports = (Invoice) => {

  require('./methods');

  let failPayOptions = function(order, options = {}) {
    let trackingCode = (order && order.trackingCode) || '';

    return {
      title: options.title || 'پرداخت ناموفق',
      heading: options.heading || 'متاسفانه پرداخت شما موفق نبود',
      subheading: `کد رهگیری: ${trackingCode}`,
      trackingCode: trackingCode,
      orderId: (order && order.id) || '',
    };
  };

  let donePayOptions = function(order, options = {}) {
    let trackingCode = (order && order.trackingCode) || '';

    return {
      title: options.title || 'پرداخت موفق',
      heading: options.heading || 'پرداخت شما با موفقیت انجام شد',
      subheading: `کد رهگیری: ${trackingCode}`,
      trackingCode: trackingCode,
      orderId: (order && order.id) || '',
    };
  };

  app.get(Invoice.payRouteName(), (req, res, next) => {
    let id = req.params.id;

    let filter = {
      where: {uid: id},
      include: ['gateway', 'order'],
    };

    app.models.Invoice.findOne(filter).then(invoice => {
      if (!invoice) return next(app.errorProvider().notFound('فاکتور'));

      const Order = app.models.Order;
      let order = invoice.__data.order;
      let lastStatus = order.lastStatus;

      if (lastStatus > Order.Status.unpaid) {
        return res.render(successView, donePayOptions(order));
      }

      req.query.Amount = invoice.payPrice;
      invoice.__data.gateway.VerifyPayment(req.query).then(result => {
        if (!result.verified) {
          return res.render(failView, failPayOptions(order));
        }

        let options = {
          order: order,
          gateway: invoice.__data.gateway,
          paid: true,
        };
        invoice.updateAttributes({status: Invoice.Status.paid}, options);

        return res.render(successView, donePayOptions(order));
      })
        .catch(error => {
          res.render(failView, failPayOptions(order));
        });
    }).catch(err => {
      let op = {
        heading: 'مشکلی در فرايند پرداخت پیش امده است. لطفا دوباره سعی کنید.',
      };

      res.render(failView, failPayOptions(undefined, op));
    });
  });
};