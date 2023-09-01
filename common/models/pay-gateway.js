'use strict';

module.exports = function(PayGateway) {
  require('./pay-gateway/')(PayGateway);

  PayGateway.prototype.htmlIcon = function() {
    let payGateway = this;
    let className = payGateway.className;

    return className && className.length > 0 ?
      `<i class="${className}" aria-hidden="true"></i>` :
      `<img style="max-height: 30px;" alt="Secure Server" src=${payGateway.iconUrl}>`;
  };
};
