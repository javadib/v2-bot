"use strict";

module.exports = (Message) => {
  require('./methods')(Message);
  require('./observes')(Message);
  require('./controllers')(Message);


  require('./seed')(Message);

};