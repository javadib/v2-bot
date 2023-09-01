"use strict";

const validator = require('validator');
const fValidator = require("fastest-validator");
const fv = new fValidator();


module.exports = (Command) => {

  Command.prototype.validate = function (data) {
    return Promise.resolve({err: {}, isValid: true});
  };

  Command.prototype.sendToken = async function (handler, args = {}) {
    let phoneNumber = handler.text || handler.user?.phoneNumber || handler.user?.mobile;

    let isMobilePhone = validator.isMobilePhone(phoneNumber, 'fa-IR');
    if (!isMobilePhone) {
      let text = `شماره وارد شده معتبر نیست. یک شماره معتبر وارد کنید.`;

      return Promise.resolve({success: false, error: {message: text}});
    }

    let token = Command.app.otpProvider.generateToken(3);

    console.log(`token is: ${token}`);
    args.otpSender?.send(handler.user, token);

    return Promise.resolve({success: true});
  }


  Command.prototype.validateFullName = async function (handler, args = {}) {
    let names = handler.text.split(' ');

    if (!names[0]) {
      let text = `نام وارد شده صحیح نیست. لطفا نام و نام خانوادگی خود را بدرستی وارد کنید.`;

      return Promise.resolve({success: false, error: {message: text}});
    }

    return Promise.resolve({success: true, data: {firstName: names[0], lastName: names[1]}});
  }

  Command.prototype.validateToken = async function (handler, args = {}) {
    let isValid = Command.app.otpProvider.validate(handler.text, 3);

    if (!isValid) {
      let text = `کد وارد شه صحیح نیست. لطفا مجدد امتحان کنید.`;

      return Promise.resolve({success: false, error: {message: text}});
    }

    return Promise.resolve({success: true});
  }


};
