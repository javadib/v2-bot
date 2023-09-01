'use strict';

module.exports = function(app) {
  const ds = app.dataSources['db'];
  const excludeModels = ['BaseModel', 'BaseUser'];
  const dsModels = app.models().filter(function(m) {
    return m.settings.autoMigrate === true &&
      excludeModels.indexOf(m.modelName) < 0;
  }).map(p => p.modelName);
  const models = dsModels.concat(['Role', 'RoleMapping', 'AccessToken', 'AppUser']);

  ds.autoupdate(models).then(() => {
    console.log(`Migration: Migrate successfully.`);

    app.models().forEach(model => {
      if (model.seed) {
        model.seed();
      }
    });
  }).catch(console.log);

};
