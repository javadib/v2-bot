'use strict';

module.exports = (Ticket) => {

  Ticket.remoteMethod(
    'expertRead', {
      isStatic: false,
      description: 'Read the specific ticket.',
      http: {"path": '/expertRead', verb: 'get'},
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}}
      ],
      returns: {arg: 'result', type: 'number', root: true, description: ''}
    }
  );

  Ticket.prototype.assignToMe = function (ctx, expertId, cb) {
    if (this.expertId) {
      var err = error.validateError(error.codes.TICKET_ALREADY_ASSIGNED, false);

      return cb(err);
    }

    if (this.lastStatus == Ticket.status.closed) {
      var err = error.validateError(error.codes.TICKET_ALREADY_CANCELED, false);

      return cb(err);
    }

    var userId = Ticket.app.get('userId');
    expertId = expertId.toLowerCase() === 'me' ? userId.toString() : expertId;
    Ticket.app.models.AppUser.findById(expertId).then(user => {
      this.updateAttributes({expertId: user.id}, cb);
    }, cb).catch(cb);
  };

  Ticket.remoteMethod(
    'assignToMe', {
      isStatic: false,
      description: 'Assign the specific ticket to the expert.',
      http: {"path": '/expert/:expertId', verb: 'get'},
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'expertId', type: 'string',  required: true, http: {source: 'path'}, description: 'expert id'},
      ],
      returns: {arg: 'result', type: 'Order', root: true, description: 'update the specific row, and assign order to specified expert.'}
    }
  );

};