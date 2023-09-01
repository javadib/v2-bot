'use strict';

module.exports = function(Invoice) {
  Invoice.paidEvent = 'invoice.paid';

  Invoice.Status = {wait: "wait", paid: "paid"};


  require('./invoice/')(Invoice);
};
