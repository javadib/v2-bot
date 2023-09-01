'use strict';

const util = require('util');
const {promisify} = require('util');
const path = require('path');

module.exports = async function (app, caller, args) {
  let {socialUser, from, chat, date} = args;

  try {
    let sUser = await app.models.SocialUser.findOrCreate({userId: from.userId}, socialUser);
    let command = await app.models.Command.findOne({where: {firstCommand: true}});

    return command.execute({client: caller, user: sUser[0], chat: chat});

  } catch (e) {
    console.log(e);
  }
}
