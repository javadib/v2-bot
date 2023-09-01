'use strict';

const fs = require('fs');
const botHandler = require('../../common/modules/bot-handler');
const tlg = require('../../common/modules/socials/tlg-client');
const axios = require("axios");
const path = require("path");

module.exports = async function (app) {

  const doSentMessage = async (args) => {
    await botClient.sendMessage(args.chat, args.user, args.text, args.options)
  };

  const newMessageReceived = async ({caller, args}) => {
    let {from, socialUser, chat, date, text} = args;

    console.log(`Message received: ${text}`);

    try {
      let f = {where: {userId: from.userId}, include: {'command': ['prev', 'next']}};
      let [sUser, isNew] = await app.models.SocialUser.findOrCreate(f, socialUser);
      console.log(`User found or created: ${text}`);

      let userCommand = sUser.__data.command;
      let command = userCommand || await app.models.Command.findOne({where: {firstCommand: true}});

      // Test new msg
      let torobCrawler = new torob(app, {});
      let axiosResponse = await torobCrawler.query(text);

      let result = axiosResponse.data;
      let items = await torobCrawler.crawl(result[0], {}) || [];

      for (const item of items.data.slice(0, 3)) {

        let message = `${item.title}

قیمت: ${item.unitPriceTitle}

لینک خرید:
${item.supplierUrl}`;

        setTimeout(async args1 => await botClient.sendPhoto(chat, sUser, item.thumbnails[0], {caption: message}), 1000)

      }

      return;


      let sessionId = `${botClient.name};${sUser.userId}`;
      let data = {id: sessionId, socialUserId: sUser.id};
      let [sSession] = await app.models.SocialSession.findOrCreate({id: sessionId}, data, {keepId: true});
      let handler = {text, chat, client: botClient, user: sUser, session: sSession};

      if (userCommand) {
        if (userCommand.postFunc) {
          let commandRes = await userCommand[userCommand.postFunc](handler, {});

          if (!commandRes.success) {
            return await botClient.sendMessage(chat, sUser, commandRes.error?.message, {});
          }
        }

        // Send successText to social user
        if (userCommand.successText) {
          let transformText = userCommand.successText.transform(Object.assign({tInput: text}, chat, sUser))
          await botClient.sendMessage(chat, sUser, transformText, {})
        }

        // Save value to session
        if (userCommand.code) {
          sSession.params.push({code: userCommand.code, name: userCommand.name, value: args.text});
          sSession.save();
        }
      }

      return command.execute(handler);
    } catch (e) {
      console.log(e);
    }
  };

  // const ig = require('../../common/modules/socials/ig-client');
  // let igClient = new ig(app, {
  //   username: 'meelovenet', password: 'milad123!@#'
  // });
  //
  // await igClient.start();


  // let botClient = new tlg(app, {
  //   secretId: '1812046003:AAHDJv8M0eilrMUMrDytCDtpvGHA3fpnn94'
  // });

  // Bale Client
  // let botClient = new bale(app, {
  //   secretId: '1880327259:W3UDLKbx7GPirm2pZ8nTQcuua4iV5bsbz9NnGh9Z'
  // });
  //
  // botClient.on(`doSendMessage`, doSentMessage)
  // botClient.on(`${botClient.name}.newMessage`, newMessageReceived)


  // await botClient.start();

  //todo: DM Strategy: (age hamintouri pm dad chi?) [save USer?, Noting? Default Mesage....?]
};
