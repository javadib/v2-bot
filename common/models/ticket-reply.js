'use strict';

const dt = require('../../loopbacker/common/utils/date-time.js');

module.exports = function(TicketReply) {
  TicketReply.disableRemoteMethodByName("upsert");
  TicketReply.disableRemoteMethodByName("create");
  TicketReply.disableRemoteMethodByName("updateAll");
  TicketReply.disableRemoteMethodByName('deleteById');
  TicketReply.disableRemoteMethodByName('replaceById');
  TicketReply.disableRemoteMethodByName("upsertWithWhere");
  TicketReply.disableRemoteMethodByName("replaceOrCreate");

  TicketReply.disableRemoteMethodByName("updateAttributes");

  TicketReply.observe('before save', function (ctx, next) {
    let ticketReply = ctx.instance || ctx.data;
    let userId = TicketReply.app.locals['userId'];

    ticketReply.userId = userId;

    next();
  });

  TicketReply.observe('after save', function (ctx, next) {
    let ticketReplyModel = ctx.instance || ctx.data;
    if (ctx.isNewInstance) {

      ticketReplyModel.ticket.getAsync().then(ticket => {
        var lastStatus = ticket.userId.toString() === ticketReplyModel.userId.toString() ? 1 : 3;
        var userReplied = ticketReplyModel.userId.toString() === ticket.userId.toString();

        if (!userReplied) {
          var expertId = ticket.expertId ? ticket.expertId : ticketReplyModel.userId;
        }

        ticket.updateAttributes({lastStatus: lastStatus, expertId: expertId || undefined});

        ticketReplyModel.updateAttributes({userReplied: userReplied});

        next();
      });
    }

  });
};
