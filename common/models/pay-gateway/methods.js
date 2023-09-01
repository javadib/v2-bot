'use strict';

const ml = require('../../modules');

module.exports = function(PayGateway) {

  PayGateway.prototype.loadModule = function() {
    let Module = ml.load(this.moduleFileName);
    let payModule = new Module({model: this, testMode: this.testMode || false});

    return payModule;
  };

  PayGateway.prototype.process = function(ctx, model, cb) {
    let req = ctx.req;
    let payGateway = this;

    if (payGateway.voucherBased) {
      payGateway.VerifyVoucher(req.body, cb);
    } else {
      payGateway.requestUrl(req.body, cb);
    }
  };

  PayGateway.prototype.VerifyVoucher = function(data, cb) {
    let payGateway = this;

    if (!payGateway.voucherBased) {
      let error = PayGateway.app.errorProvider();
      let err = error.validateError('error.payment.notVoucherBased');

      cb && cb(err);
      return Promise.reject(err);
    }

    let payModule = this.loadModule();
    //TODO:
    payModule.VerifyVoucher()
  };

  PayGateway.prototype.requestUrl = function(data, cb) {
    let payModule = this.loadModule();

    return payModule.payRequest(data, cb);
  };

  PayGateway.prototype.VerifyPayment = function(data, cb) {
    let payModule = this.loadModule();

    return payModule.payVerification(data, cb);
  };

};