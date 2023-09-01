'use strict';

const async = require('async');

module.exports = function(StoreCategory) {
  StoreCategory.disableRemoteMethodByName('__create__actives');
  StoreCategory.disableRemoteMethodByName('__delete__actives');

  StoreCategory.prototype.addFilters = function (filters, user, cb) {
    let StoreCategory = this;

    async.each(filters, item => {
      let options = {userId: user.id, priority: item.priority || 0};
      StoreCategory.filters.create(item, options, console.log)
    }, cb && cb);
  };

};
