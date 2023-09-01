const util = require('util');

module.exports = function(Model, options) {

  Model.consoleLog = (err, result) => err ?
    Model.errorLog(Model.modelName, err) :
    Model.successLog(Model.modelName, result);

  Model.successLog = (ctx, value) =>
    console.log(`${ctx} saved: ${util.inspect(value)}`);

  Model.errorLog = (ctx, error) =>
    console.log(`An error occur in ${ctx}: ${util.inspect(error)}`);

};

