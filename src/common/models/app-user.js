'use strict';

const error = require('../../loopbacker/src/common/utils/error-provider');

module.exports = function(AppUser) {
  require('./app-user/')(AppUser);

  // AppUser.disableRemoteMethodByName('create');
  AppUser.disableRemoteMethodByName('replaceById');
  AppUser.disableRemoteMethodByName('upsertWithWhere');
  AppUser.disableRemoteMethodByName("upsert");
  AppUser.disableRemoteMethodByName("updateAll");
  // AppUser.disableRemoteMethodByName('deleteById');
  AppUser.disableRemoteMethodByName("replaceOrCreate");
  AppUser.disableRemoteMethodByName("login");
  AppUser.disableRemoteMethodByName("confirm");
  AppUser.disableRemoteMethodByName("resetPassword");
  AppUser.disableRemoteMethodByName("logout");
};
