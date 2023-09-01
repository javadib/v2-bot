'use strict';

const util = require('util');
const _ = require('lodash');
const async = require('async');

const error = require('../../../loopbacker/common/utils/error-provider');

module.exports = (SocialSession) => {

  SocialSession.prototype.displayText = function () {
    let sSession = this;

    return sSession.params.map(p => `${p.name} : ${p.value}`).join('\n\n')
  };

};
