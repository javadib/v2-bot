'use strict';

module.exports = (AppUser) => {

  AppUser.observe('before save', function (ctx, next) {
    let user = ctx.instance || ctx.data;

    user.roleName = undefined;

    next();
  });

  AppUser.afterRemote('authenticate', function setLoginCookie(context, accessToken = {}, next) {
    let res = context.res;
    let req = context.req;
    let token = accessToken.id;
    let options = context.options || {};
    let redirectTo = options.redirect || '/';

    if (token !== null) {
      req.accessToken = accessToken;
      req.afterAuthenticate = true;

      res.cookie('access_token', token, {
        // signed: req.signedCookies ? true : false,
        signed: req.signedCookies,
        maxAge: 1000 * accessToken.ttl,
      });

      // return res.redirect(redirectTo);
    }

    return next();
  });

};