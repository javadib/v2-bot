'use strict';

const async = require('async');


module.exports = (Command) => {

  Command.prototype.transform = function (data) {
    return Promise.resolve({data: data});
  };

  Command.prototype.displayText = function () {
    let cmd = this;

    return cmd.helpText ? `${cmd.body}\n\n${cmd.helpText}` : cmd.body;
  }

  Command.prototype.sendCommand = function (handler, validator) {
    let command = this;
    let selectedCmd = validator.isValid && command.__data.next ?
      command.__data.next : command;


    return new Promise((resolve, reject) => {
      // let args = {chat: handler.chat, user: handler.user, text: selectedCmd.body, options: {}};
      // handler.client.emit('doSendMessage', args);
      let text = selectedCmd.displayText();
      handler.client.sendMessage(handler.chat, handler.user, text, {})
        .then(result => resolve({
          sendMessageResult: result,
          command: selectedCmd,
          isValid: validator,
        }))
        .catch(reject);
    });
  };

  Command.prototype.execute = function (handler) {
    let command = this;
    return command.transform()
      .then(command.validate)
      .then(validator => command.sendCommand(handler, validator))
      .then(p => {
        let updateData = p.command.lastCommand ? {lastCommand: null} : {lastCommand: p.command.id};
        handler.user.updateAttributes(updateData);

        if (p.command.lastCommand) {
          let message = `پیش نمایش سفارش شما:

${handler.session.displayText()}

برای تایید عدد 1 رو بفرستید`;

          handler.client.sendMessage(handler.chat, handler.user, message, {})
        }
      })
      .catch(err => {
        console.error(err);

        //TODO: log & notif to dve team
        //TODO: msg to client
      });
  };

};


function template(strings, ...keys) {
  return (...values) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });

    return result.join("");
  };
}
