'use strict';

module.exports = function() {
  function applyToEnNumber(string) {
    return string.replace(/[\u0660-\u0669]/g, function(c) {
      return c.charCodeAt(0) - 0x0660;
    }).replace(/[\u06f0-\u06f9]/g, function(c) {
      return c.charCodeAt(0) - 0x06f0;
    });
  }

  function applyYeKe(text) {
    return text.replace(/\u0643/g, '\u06A9') // ک
      .replace(/\u0649/g, '\u06CC') // ی
      .replace(/\u064A/g, '\u06CC'); // ی
  }

  function transform(body, next) {
    Object.keys(body).forEach(key => {
      if (typeof body[key] === 'string') {
        body[key] = applyToEnNumber(body[key]);

        body[key] = applyYeKe(body[key]);
      }
    });

    return next();
  }

  return function(req, res, next) {
    let skipTransform = !req.body || req.query.skipTransform == true; // know about == & ===

    if (skipTransform) return next();

    transform(req.body, next);
  };
};
