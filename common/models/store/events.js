"use strict";

const async = require('async');

module.exports = (Store) => {

  Store.on('modelUpdated', result => {
    const err = result.err;
    if (err) return;
    // {err: err, result: result, methodName: methodName, id: id}
    const id = result.id || '';

    console.log(`id: ${id}`);

    Store.findById(id).then(model => {
      let confirmBusiness = model.isActive;

      console.log(`confirmBusiness: ${confirmBusiness}`);
      if (confirmBusiness) {
        async.parallel({
          user: function (callback) {
            model.user.getAsync(callback);
          },
          storeCategory: function (callback) {
            model.storeCategory.getAsync(callback);
          }
        }, (err, result) => {
          const businessOwner = result.user;
          const storeCategory = result.storeCategory;

          console.log(`businessOwner: ${businessOwner}
          storeCategory: ${storeCategory}`);

          const msg = `سامانه آینو
کسب و کار ${storeCategory.name} ${model.title} با موفقیت تایید گردید و در سامانه بارگذاری شد.`;

          businessOwner.sendSms(msg, console.log);
        });
      }
    })
  });

};