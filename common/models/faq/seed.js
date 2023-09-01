"use strict";

const async = require('async');
const seedData = require('./seed-data.js');

module.exports = function (Faq) {

  Faq.seed = function (cb) {

    async.each(seedData.data.data, item => {
      let q = {where: {name: item.model.title}};
      Faq.findOrCreate(q, item.model, cb);
    }, cb);
  }

};