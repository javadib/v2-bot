"use strict";

const async = require('async');
const seedData = require('./seed-data.js');

module.exports = function (AppPublisher) {
  AppPublisher.seed = function (cb) {
    async.each(seedData.data.data, item => {
      let q = {where: {name: item.model.name}};
      AppPublisher.findOrCreate(q, item.model, cb);
    }, cb);
  }

};