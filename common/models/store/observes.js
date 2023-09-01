"use strict";


const util = require('util');
const async = require('async');

module.exports = (Store) => {
  // function validateMaxStore(err, options, done) {
  //   let store = this;
  //   store.owner({include: ['configure', 'stores']}, (lErr, user) => {
  //     if (lErr) err(lErr);
  //
  //     let maxOwnStore = user.__data.configure.maxOwnStore;
  //
  //     if (user.__data.stores.length >= maxOwnStore) err();
  //
  //     done();
  //   });
  // }
  //
  // //TODO: just in create mode
  // Store.validateAsync('title', validateMaxStore,
  //   {message: 'خطای حداکثر فروشگاه مجاز'});

  Store.observe('before save', function(ctx, next) {
    let data = ctx.data;
    let options = ctx.options || {};
    let instanceOrData = ctx.instance || ctx.data;
    let instance = ctx.instance || ctx.currentInstance;
    let isNewInstance = ctx.isNewInstance === true;

    if (isNewInstance) {
      //TODO: valid max own store
    }

    next();
  });
};