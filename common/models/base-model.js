'use strict';

module.exports = function(BaseModel) {
  BaseModel.setup = function() {
    // We need to call the base class's setup method
    BaseModel.base.setup.call(this);
    var UserModel = this;

    //type your shared code here

    return UserModel;
  };

  BaseModel.setup();
};

