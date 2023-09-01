'use strict';

const async = require('async');

module.exports = function(ProductCategory) {
  ProductCategory.disableRemoteMethodByName('__create__actives');
  ProductCategory.disableRemoteMethodByName('__delete__actives');

  ProductCategory.prototype.addFilters = function (filters, user, cb) {
    let StoreCategory = this;

    async.each(filters, item => {
      let options = {userId: user.id, priority: item.priority || 0};
      StoreCategory.filters.create(item, options, console.log)
    }, cb && cb);
  };

};
