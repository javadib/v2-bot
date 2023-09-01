"use strict";

const async = require('async');

const util = require('util');

const error = require('../../../loopbacker/common/utils/error-provider');

module.exports = (Store) => {

  Array.prototype.searchIn = function(another = []) {
    let covered = true;

    this.forEach(p => {
      if (another.indexOf(p) < 0) {
        covered = false;
      }
    });

    return covered;
  };

  Store.prototype.updateStat = function (data, options = {}, cb) {
    const model = this;
    const app = Store.app;
    const BusinessStatistic = app.models.BusinessStatistic;

    BusinessStatistic.upsertStats(model.id, data, options, cb && cb);
  };

  Store.prototype.fullRate = function (ctx, cb) {
    const store = this;

    store.rates.getAsync({"include": ["rateQuestion"] }).then(rates => {
      store.__data.rates = rates;

      cb(null, store);
    }, cb  && cb)
  };

  Store.remoteMethod(
    'prototype.fullRate', {
      description: 'Get specific store with rates.',
      http: {"path": '/fullRate', verb: 'get'},
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}}
      ],
      returns: {arg: 'result', type: Store, root: true, description: ''}
    }
  );


  Store.prototype.similar = function (ctx, cb) {
    let store = this;
    let tolerance = 10;
    let min = store.discount - tolerance;
    let max = store.discount + tolerance;
    let filter = {where: {discount: {between: [min, max] }}};

    Store.find(filter, cb);
  };

  Store.remoteMethod(
    'prototype.similar', {
      description: 'Get the similar businesses',
      http: {"path": '/similar', verb: 'get'},
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}}
      ],
      returns: {arg: 'result', type: Store, root: true, description: ''}
    }
  );

};
