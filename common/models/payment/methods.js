"use strict";

const dt = require("../../../loopbacker/common/utils/date-time.js");

const UNKNOWN = 'UNKNOWN';

module.exports = function (Payment) {

  Payment.TypeTitle = {0: 'Income', 1: 'Expense'};
  Payment.MethodTitle = {0: 'Online', 1: 'Credit', 2: 'POS', 3: 'Cash', 4: 'USSD', 5: 'SYSTEM'};

  Payment.getter.payTypeTitle = function () {
    const payment = this;
    const payTitle = Payment.TypeTitle[payment.payType] || UNKNOWN;

    return payTitle;
  };

  Payment.getter.payMethodTitle = function () {
    const payment = this;
    const payTitle = Payment.MethodTitle[payment.payMethod] || UNKNOWN;

    return payTitle;
  };
};
