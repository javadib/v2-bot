'use strict';

const multer = require('multer');

module.exports = function (server) {
  server.use(multer().any()); // for parsing multipart/form-data
};
