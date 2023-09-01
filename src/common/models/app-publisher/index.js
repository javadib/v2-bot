"use strict";

module.exports = function(AppPublisher) {
  require('./methods')(AppPublisher);
  require('./observes')(AppPublisher);
  require('./controllers')(AppPublisher);

  require('./seed')(AppPublisher);
};