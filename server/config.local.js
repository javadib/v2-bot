module.exports = {
  remoting: {
    errorHandler: {
      handler: function(err, req, res, next) {
        // custom error handling logic

        if (err.code === 11000) {
          let instance = req.remotingContext.instance;
          let methodName = req.remotingContext.method.name;
          let contextInstance = instance.getModelFromKey(methodName);

          err.message = new req.app.models[contextInstance]().uniqueErrorMessage();
        }

        let env = req.app.get('env');
        let showStack = req.query.stk === '1234567890';
        err.message = err.message || `One or more error accrue.see details.`;
        let result = {
          data: null,
          // error: err,
          error: {
            code: err.code || err.codes,
            message: err.message,
            statusCode: err.statusCode,
            stack: env !== 'production' || showStack ? err.stack : undefined,
          },
          success: false
        };

        req.app.emit("remoteCalled", {ctx: {req: req, res: res, result: result}});

        res.json(result);
        // next(result);
      }
    }
  }
};
