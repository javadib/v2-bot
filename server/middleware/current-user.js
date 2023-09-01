const error = require("../../loopbacker/common/utils/error-provider");

module.exports = function() {
  let logger = false;
  const L = (msg, ...args) => {
    if (logger) {
      console.log(msg, args);
    }
  };

  return function setCurrentUser(req, res, next) {
    var app = req.app;
    var User = app.models.AppUser;

    app.locals.userAgent = req.headers['user-agent'];
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    app.locals.userIp = ip;

    let userId = req.accessToken && req.accessToken.userId;

    app.locals.userId = userId || undefined;
    L(`current user mid. userId: ${userId}`);

    if (!userId) return next();

    User.findById(userId).then(user => {
      if (user && user.isActive === false) {
        const err = error.validateError('Your account has been blocked! contact to administrator.');

        return next(err);
      }

      app.locals.user = user;

      return next();
    });
  }
};
