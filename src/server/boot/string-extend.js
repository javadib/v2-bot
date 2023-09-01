'use strict';

module.exports = function (app) {

  String.prototype.fixNumbers = function () {
    let str = this;
    let
      persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
      arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

    if (typeof str !== 'string') {
      console.log(`use in string variables`);

      return str;
    }

    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }

    return str;
  }

};
