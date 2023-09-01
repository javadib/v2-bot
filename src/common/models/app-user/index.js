"use strict";

module.exports = (AppUser) => {

  require('./methods')(AppUser);
  require('./socials')(AppUser);
  require('./observes')(AppUser);
  require('./controllers')(AppUser);

  require('./seed')(AppUser);
};
