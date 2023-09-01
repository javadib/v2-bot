"use strict";

module.exports = function(Payment) {
  require('./methods')(Payment);
  require('./observes')(Payment);
  require('./controllers')(Payment);

  require('./seed')(Payment);
};