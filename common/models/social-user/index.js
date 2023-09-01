"use strict";

module.exports = (SocialUser) => {

  require('./methods')(SocialUser);
  require('./observes')(SocialUser);
  require('./controllers')(SocialUser);

  // require('./seed')(SocialUser);
};
