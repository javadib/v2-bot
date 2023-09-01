module.exports = function() {
  return function logError(err, req, res, next) {

    let env = req.app.get('env');
    let showStack = req.query.stk === '1234567890';
    let result = {
      data: null,
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        stack: env !== 'production' || showStack ? err.stack : undefined,
      },
      success: false,
    };

    req.app.emit('remoteCalled', {ctx: {req: req, res: res, result: result}});

    res.json(result);
    // next(result);
  };
};
