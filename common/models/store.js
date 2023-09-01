'use strict';

module.exports = function(Store) {
  require('./store/')(Store);

  Store.disableRemoteMethodByName('__create__actives');
  Store.disableRemoteMethodByName('__delete__actives');

  // let min = 3;
  // let max = 5;
  // let message = util.format("%s باید بین f% و n% باشد.", 'مقدار درصد', min, max);
  // Store.validatesLengthOf('discount', {min: min, max: max, message: {min: message, max: message, } });


};