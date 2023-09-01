"use strict";

module.exports = (Store) => {
  require('./methods')(Store);
  require('./observes')(Store);
  require('./controllers')(Store);

  require('./events')(Store);

  // require('./seed')(Store);
};
