"use strict";

module.exports = (AppSetting) => {

  require('./observes')(AppSetting);
  require('./methods')(AppSetting);
  require('./controllers')(AppSetting);

  require('./seed')(AppSetting);

};