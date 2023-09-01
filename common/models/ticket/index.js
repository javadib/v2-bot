"use strict";

module.exports = (Ticket) => {

  require('./methods')(Ticket);
  require('./observes')(Ticket);
  require('./controllers')(Ticket);

};