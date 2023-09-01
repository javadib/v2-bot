'use strict';

module.exports = (AppUser) => {
  require('./methods')(AppUser);

  AppUser.prototype.sendMessage = function(socialClient, message, options, cb) {
    return socialClient.sendMessage(this, message, options, cb);
  };

  AppUser.prototype.updateIgInfo = function(igUser, options, cb) {
    let data = {
      'igUserId': igUser.pk,
      'igUsername': igUser.username,
      'igVerified': true,
    };

    return this.updateAttributes(data, options, cb);
  };

  AppUser.buildUser = function(igUser) {
    let fullName = igUser.full_name.split();
    let newUser = {
      'firstName': fullName[0],
      'lastName': fullName[1],
      'password': `1234567890`, //todo: fixme
      'igUserId': igUser.pk,
      'igUsername': igUser.username,
      'igVerified': true,
      'mobileVerified': false,
      'isActive': true,
    };

    return newUser;
  };
};
