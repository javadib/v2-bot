"use strict";

const seed = require('./data/seed.json');

module.exports = (Message) => {
  Message.seed = function () {
    seed.data.forEach(item => {
      Message.create(item.model, {roleName: item.roleName}, Message.consoleLog);
    })
  }
};