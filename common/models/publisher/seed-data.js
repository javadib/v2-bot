'use strict';

module.exports = {
  data: {
    name: 'seed publisher',
    data: [
      {
        model: {
          "name": "Trez SMS",
          "key": "default_sms",
          "type": "sms",
          "username": "javadib",
          "password": "SbQTW7kF5TMRaw7",
          "sender": "50002910001080",
          "moduleUrl": "http://smspanel.Trez.ir/SendMessageWithPost.ashx",
          "modulePort": undefined,
          "moduleFileName": "./sms/trez/index.js",
          "iconUrl": undefined,
          "iconClassName": undefined,
          "className": undefined,
          "description": undefined,
          "isSystem": true,
          "isActive": true
        }
      },
      {
        model: {
          "name": "meelove.net",
          "key": "info_email",
          "type": "email",
          "username": "info@meelove.net",
          "password": "qlqP123!@#",
          "sender": "mail.meelove.net",
          "moduleUrl": "mail.meelove.net",
          "modulePort": 465,
          "moduleFileName": "./email/smtp/index.js",
          "iconUrl": undefined,
          "iconClassName": undefined,
          "className": undefined,
          "description": undefined,
          "isSystem": true,
          "isActive": true
        }
      },
    ],
  },
};