'use strict';

module.exports = function(FaqCategory) {
  FaqCategory.disableRemoteMethodByName("upsert");
  FaqCategory.disableRemoteMethodByName("updateAll");
  FaqCategory.disableRemoteMethodByName('deleteById');

};
