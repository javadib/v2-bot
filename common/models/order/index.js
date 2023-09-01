"use strict";

module.exports = (Order) => {
  require('./methods')(Order);
  require('./observes')(Order);
  require('./controllers')(Order);

  require('./events')(Order);
};