'use strict';

const url = require('url');

module.exports = (Invoice) => {
  Invoice.payRouteName = function() {
    return `/invoices/:id`;
  };

  Invoice.prototype.payCallbackUrl = function() {
    const invoice = this;

    const callbackUrl = url.resolve(
      Invoice.app.getBaseUrl(), `/invoices/${invoice.uid}`,
    );

    return callbackUrl;
  };
};
