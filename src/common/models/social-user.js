'use strict';

const error = require('../../loopbacker/src/common/utils/error-provider');

module.exports = function(SocialUser) {
  require('./social-user/')(SocialUser);
};
