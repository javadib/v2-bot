'use strict';

const util = require('util');
const {promisify} = require('util');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const EventEmitter = require('events');


module.exports = class TlgClient extends EventEmitter {

  name = 'TelegramBot';

  constructor(app, cred, handler) {
    super();

    this._app = app;
    this._cred = cred;
    this._handler = handler;

    // Create a bot that uses 'polling' to fetch new updates
    this.botClient = new TelegramBot(cred.secretId, {polling: true});
  }

  async start() {
    // Matches "/echo [whatever]"
    this.botClient.onText(/\/echo (.+)/, (msg, match) => {

      const chatId = msg.chat.id;
      const resp = match[1]; // the captured "whatever"
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {text: 'Share your phone', callback_data: 'edit', request_contact: true}
            ],
            // [{ text: 'View call schedule', callback_data: 'rings' }]
          ]
        }
      };

      let socialUser = this.#toSocialUser(msg.from);
      msg.socialUser = socialUser;
      this.emit(`${this.name}.newMessage`, {caller: this, args: msg})

      return this._handler && this._handler(this._app, this, {
        from: msg.from,
        chat: msg.chat,
        socialUser,
        date: msg.date
      })
    });

    // Listen for any kind of message. There are different kinds of messages.
    this.botClient.on('message', (msg) => {
      const chatId = msg.chat.id;

      let socialUser = this.#toSocialUser(msg.from);
      msg.socialUser = socialUser;

      this.emit(`${this.name}.newMessage`, {caller: this, args: msg})

      return this._handler && this._handler(this._app, this, {
        from: msg.from,
        chat: msg.chat,
        socialUser,
        date: msg.date
      })
    });

    // Handle callback queries
    this.botClient.on('callback_query', function onCallbackQuery(callbackQuery) {
      const action = callbackQuery.data;
      const msg = callbackQuery.message;
      const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
      };

      let text;
      if (action === 'edit') {
        text = 'Edited Text';
      }

      this.botClient.editMessageText(text, opts);
    });

    console.log(`${this.name} started ...`);
  }

  async sendMessage(chat, user, message, options) {
    let chatId = chat?.id || user?.id;

    return this.botClient.sendMessage(chatId, message, options);
  }

  #toSocialUser(instance) {
    return {
      firstName: instance.first_name,
      lastName: instance.last_name,
      username: instance.username || instance.userName || instance.user_name,
      userId: instance.id
    }
  }

};
