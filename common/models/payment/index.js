"use strict";

module.exports = function(Payment) {
  require('./methods')(Payment);
  require('./observes')(Payment);
  require('./events')(Payment);
  require('./controllers')(Payment);
};