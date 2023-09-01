"use strict";

const seed = require('./seed-data');

module.exports = (Command) => {
  Command.seed = function () {
    seed.data.data.forEach(item => {
      Command.upsert(item.model,  {keepId: true}, Command.consoleLog)
    })
  }
};
