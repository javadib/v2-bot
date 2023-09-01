"use strict";

const app = require('../../../server/server');

module.exports = function(PayGateway) {

  app.get('/pay:id', (req, res, next) => {
    let query = req.query;
    let id = query && query.params && query.params.id;

    PayGateway.findById(id)
      .then(gateway => {
        if (!gateway) return next();

        //TODO: show ui to pay process
      })
      .catch(next && next)
  })

};