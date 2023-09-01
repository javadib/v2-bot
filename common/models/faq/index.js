"use strict";

module.exports = (Faq) => {
  require('./methods')(Faq);
  require('./observes')(Faq);
  require('./controllers')(Faq);

  require('./seed')(Faq);
};
