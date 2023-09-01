'use strict';

const util = require('util');
const url = require("url");


const error = require('../../loopbacker/common/utils/error-provider');
const dt = require('../../loopbacker/common/utils/date-time');

module.exports = function (Order) {
  Order.paidEvent = 'order.paid';
  Order.reviewEvent = 'review_event';

  require('./order/')(Order);

  // Order.disableRemoteMethodByName("upsert");
  // Order.disableRemoteMethodByName('create');
  // Order.disableRemoteMethodByName("updateAll");
  Order.disableRemoteMethodByName("replaceOrCreate");
  Order.disableRemoteMethodByName("upsertWithWhere");

  //Disable update method for OrderPayments
  Order.disableRemoteMethodByName('__delete__payments');
  Order.disableRemoteMethodByName('__destroyById__payments');

  Order.validatesInclusionOf('lastStatus', {in: [-1, 0, 1, 2, 3, 4]});

  Order.validatesInclusionOf('lastStatus', {in: [-1, 0, 1, 2, 3, 4]});

  Order.Status = {canceled: -1, unpaid: 0, paid: 1, preparing: 2, sent: 3, delivered: 4};

  Order.statusTitle = {
    [-1]: 'لغو شد',
    0: 'پرداخت نشده',
    1: 'پرداخت شد',
    2: 'درحال آماده سازی',
    3: 'ارسال شد',
    4: 'تحویل شد',
  };

  Order.getAllStatus = function (exceptions = []) {
    let result = [];

    Object.keys(Order.statusTitle)
        .filter(p => exceptions.indexOf(p) < 0)
        .map(p => Number(p))
        .reduce((a, key) => {
          // result[key] = Order.statusTitle[key]
          result.push({id: key, title: Order.statusTitle[key]});
        }, {});

    return result;
  };

  Order.validate('payablePrice', payablePriceValidator, {
    code: 'TOTAL_PRICE_VALIDATOR',
    message: 'should great than 0.'
  });

  function payablePriceValidator(err) {
    let payablePrice = this.payablePrice;

    if (payablePrice <= 0) err();
  }

  Order.validate('lastStatus', lastStatusValidator, {
    code: 'ORDER_WAS_CANCELED',
    message: 'این سفارش کنسل شده و قابل تغییر نیست.'
  });

  function lastStatusValidator(err) {
    let lastStatus = this.lastStatus;

    if (lastStatus === Order.Status.canceled) err();
  }

  Order.computeLastStatusTitle = function (order) {
    const statusTitle = Order.statusTitle[order.lastStatus];

    return statusTitle || 'نامشخص';
  };

  Order.computeTotalPriceTitle = function (model) {
    return Number(model.totalPrice).toLocaleString();
  };

  Order.computePayablePriceTitle = function (model) {
    return Number(model.payablePrice).toLocaleString();
  };

  Order.getter.payablePrice = function () {
    let model = this;
    const payablePrice = model.totalPrice - (model.discountPrice || 0);

    return payablePrice > 0 ? payablePrice : 0;
  };

  Order.getter.payablePriceTitle = function () {
    let model = this;
    const localPriceTitle = Number(model.payablePrice).toLocaleString();

    return localPriceTitle;
  };

  function perDate(user, param, match) {
    switch (param) {
      case 'd':
        return [
          {$match: user ? {createdOn: match, userId: user,} : {createdOn: match}},
          {$group: {_id: {$dateToString: {format: "%Y/%m/%d", date: "$createdOn"}}, sum: {$sum: "$totalPrice"}}},
          {$project: {date: "$_id", sum: 1, _id: 0}},
          {$sort: {date: 1}}
        ];
      case 'm':
        return [
          {$match: user ? {createdOn: match, userId: user} : {createdOn: match}},
          {$sort: {createdOn: -1}},
          {
            $group: {
              _id: {month: {$month: "$createdOn"}, year: {$year: "$createdOn"}},
              sum: {$sum: "$totalPrice"}
            }
          },
          {$project: {date: '$_id', sum: 1, _id: 0}}
        ];
    }
  }

  Order.saleStat = function (ctx, param, latest, options, cb) {
    const fromDate = new Date();
    param = param.toLowerCase();
    const latestFrom = latest || 10;

    param === 'd' ?
        fromDate.setDate(fromDate.getDate() - latestFrom) :
        param === 'm' ?
            fromDate.setMonth(fromDate.getMonth() - latestFrom) :
            undefined;

    const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());

    const option = perDate(options && options.userId, param, {$gte: from});

    if (!option) return cb(error.validateError(`Param ${param} not defined.`, true, {code: 'PARAM_NOT_DEFINED'}));

    const collection = Order.getDataSource().connector.collection(Order.modelName);
    collection.aggregate(option, {allowExtendedOperators: true}, function (err, result) {
      if (err) return cb(err);

      if (!Array.isArray(result)) return cb(null, result);

      result.forEach(p => p.DateFA = dt.toJalaali(p.date));

      return cb(null, result);
    });
  };

  Order.remoteMethod(
      'saleStat', {
        description: 'system Sale static.',
        http: {path: '/:param/saleStat', verb: 'get'},
        accepts: [
          {arg: 'ctx', type: 'object', http: {source: 'context'}},
          {arg: 'param', type: 'string', required: true},
          {arg: 'latest', type: 'number', http: {source: 'query'}},
          {arg: 'options', type: 'object', http: {source: 'query'}},
        ],
        returns: {arg: 'result', type: 'string', root: true, description: 'Sum of sale in local price.'}
      }
  );

};
