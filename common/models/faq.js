'use strict';

module.exports = function(Faq) {
  require('./faq/')(Faq);

  Faq.disableRemoteMethodByName("upsert");
  Faq.disableRemoteMethodByName("updateAll");
  Faq.disableRemoteMethodByName('deleteById');
};
