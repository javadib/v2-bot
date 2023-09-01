"use strict";

const dt = require('../../../loopbacker/common/utils/date-time.js');

module.exports = (Ticket) => {

  Ticket.status = {closed: 0, waitForAnswer: 1, expertRead: 2, answered: 3};
  Ticket.priorityTitle = {0: 'Low', 1: 'Medium', 2: 'High', 3: 'Immediately'};
  Ticket.statusTitle = {0: 'Closed', 1: 'Waiting', 2: 'Read', 3: 'Replied'};


  Ticket.getter.priorityTitle = function () {
    var ticket = this;
    var title = ticket ? Ticket.priorityTitle[ticket.priority] : 'نامشخص';

    return title;
  };

  Ticket.getter.lastStatusTitle = function () {
    var ticket = this;

    var title = ticket ? Ticket.statusTitle[ticket.lastStatus] : 'نامشخص';

    return title;
  };

  Ticket.prototype.expertRead = function (ctx, cb) {
    var ticket = this;
    var userId = Ticket.app.get('userId');

    ticket.updateAttributes({lastStatus: 2, expertId: userId}, cb);
  };


};
