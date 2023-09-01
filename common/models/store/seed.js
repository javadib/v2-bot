"use strict";

const async = require('async');
const seedData = require('./seed-data.js');

module.exports = function (Store) {

  Store.seed = function (cb) {
    async.each(seedData.data.data, item => {
      let q = {where: {name: item.model.title}};
      Store.findOrCreate(q, item.model, cb);
    }, cb);
  }
};