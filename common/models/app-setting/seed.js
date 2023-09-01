"use strict";

const seed = require('./data/seed.json');

module.exports = (AppSetting) => {
  AppSetting.seed = function () {
    return;
    seed.data.forEach(item => {
      let query = {where: {code: item.model.code}};
      AppSetting.findOrCreate(query, item.model, {}, AppSetting.consoleLog);
    })
  }
};
