"use strict";

module.exports = (SocialSession) => {

  require('./methods')(SocialSession);
  require('./observes')(SocialSession);
  require('./controllers')(SocialSession);
};
