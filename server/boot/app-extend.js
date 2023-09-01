'use strict';

module.exports = function (app) {
  global.L = console.log;
  global.W = console.warn;
  global.E = console.error;
  global.D = console.debug;

  global.handleLog = (err, data, showData) => (
    err ? W(err) :
      showData ? L(`${this.call} - ${data}`) : L('operate successfully.')
  );

  // fixme: read from req orr  ....?
  app.getBaseUrl = function() {
    return app.settings.baseUrl || app.settings.url;
  };

  app.errorProvider = function() {
    return require('../../loopbacker/common/utils/error-provider');
  };
};
