"use strict";

const seed = require('./data/seed.json');

module.exports = (AppUser) => {
  AppUser.seed = function () {
    seed.data.forEach(item => {
      let query = {where: {username: item.model.username}};
      // AppUser.create(item.model, {roleName: item.roleName}).then(user => {})
      AppUser.findOrCreate(query, item.model, {roleName: item.roleName},
          AppUser.consoleLog);
    })
  }
};