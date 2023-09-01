"use strict";

const data = require('./seed.json');

module.exports = function (PayGateway) {

  PayGateway.seed = function () {
    PayGateway.create(data.data, console.log);
  }

};