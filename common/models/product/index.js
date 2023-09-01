"use strict";

module.exports = function(Product) {
  require('./methods')(Product);
  require('./observes')(Product);
  require('./controllers')(Product);

  require('./seed')(Product);
};