'use strict';

const error = require('../../loopbacker/common/utils/error-provider');

module.exports = function(SocialSession) {
  require('./social-session/')(SocialSession);
};
