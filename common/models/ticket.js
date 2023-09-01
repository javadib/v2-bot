'use strict';

module.exports = function(Ticket) {
  require('./ticket/')(Ticket);

  Ticket.disableRemoteMethodByName("upsert");
  Ticket.disableRemoteMethodByName("create");
  Ticket.disableRemoteMethodByName("updateAll");
  Ticket.disableRemoteMethodByName('deleteById');
  Ticket.disableRemoteMethodByName('replaceById');
  Ticket.disableRemoteMethodByName("upsertWithWhere");
  Ticket.disableRemoteMethodByName("replaceOrCreate");

  //Disable update method for comments
  Ticket.disableRemoteMethodByName('__delete__comments');
  Ticket.disableRemoteMethodByName('__destroyById__comments');

  Ticket.validatesInclusionOf('priority', {in: [0, 1, 2, 3]});

  Ticket.validatesInclusionOf('lastStatus', {in: [0, 1, 2, 3]});
};
