module.exports = function() {
  return function refreshToken(req, res, next) {
    let token = req.accessToken;

    if (!token) {
      return next();
    }

    let now = new Date();
    if (now - token.created < 1000) { //skip near request.
      return next();
    }

    token.created = now;
    // token.ttl = 1209600; //Two week
    token.save(next);
  }
};
