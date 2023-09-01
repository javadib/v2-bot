'use strict';

module.exports = function(Model, options) {
  Model.disableRemoteMethodByName('upsert');
  Model.disableRemoteMethodByName('replaceById');
  Model.disableRemoteMethodByName('updateAll');
  Model.disableRemoteMethodByName('replaceOrCreate');
  Model.disableRemoteMethodByName('upsertWithWhere');
  Model.disableRemoteMethodByName('createChangeStream');
};
