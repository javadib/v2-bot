'use strict';
module.exports = function(app) {
  const remotes = app.remotes();

  // modify all returned values
  remotes.after('**', function(ctx, next) {
    ctx.result = {
      data: ctx.result,
      error: null,
      success: true,
    };

    app.emit('remoteCalled', {ctx: ctx});

    next();
  });
};
