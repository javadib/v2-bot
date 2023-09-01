"use strict";

module.exports = (Invoice) => {
  require('./methods')(Invoice);
  require('./observes')(Invoice);
  require('./controllers')(Invoice);

  require('./events')(Invoice);
};