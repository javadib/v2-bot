"use strict";

module.exports = (Command) => {

  require('./observes')(Command);
  require('./methods')(Command);
  require('./validations')(Command);
  require('./controllers')(Command);

  require('./seed')(Command);

};
