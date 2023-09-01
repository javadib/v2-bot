'use strict';

const otplib = require('otplib');

// Alternative:
// const secret = authenticator.generateSecret();
// Note: .generateSecret() is only available for authenticator and not totp/hotp

module.exports = class OtpLibClient {

  name = 'OtpLibClient';

  constructor(app, secret, options = {}) {
    this._app = app;
    this.secret = secret;
    this.client = otplib.totp;
    this.client.options = options;
  }

  generateToken(counter) {
    return this.client.generate(this.secret);
  }

  validate(token, counter) {
    try {
      const isValid = this.client.check(token, this.secret);
      // const isValid = this.client.verify({token, secret: this.secret});

      return isValid;
    } catch (err) {
      console.error(err);

      return false;
    }
  }

};
