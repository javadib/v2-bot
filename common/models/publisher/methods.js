"use strict";

const async = require('async');

const error = require('../../../loopbacker/common/utils/error-provider');
const ml = require("../../modules");

module.exports = function (AppPublisher) {

  AppPublisher.defaultPublish2 = function (type, details, cb) {
    AppPublisher.findOne({where: {type: type}}).then(pub => {
      if (!pub) return error.notFound();

      return pub.publish(details, cb);
    });
  };

  AppPublisher.defaultPublish = function (type, message, to, userId, cb) {
    AppPublisher.findOne({where: {type: type}}).then(pub => {
      if (!pub) return error.notFound();

      return pub.defaultPublish(message, to, userId, cb);
    });
  };

  AppPublisher.prototype.defaultPublish = function (message, to, userId, cb) {
    let data = {
      "message": message,
      "type": "info",
      "dataType": "plain",
      "receiver": to,
      "iconUrl": undefined,
      "iconClassName": undefined,
      "isRead": false,
      "userId": userId
    };

    this.publish(data, cb);
  };

  AppPublisher.prototype.send = function (data = {}, options = {}, cb) {
    options = typeof options === 'function' ? undefined : options;
    cb = typeof cb === 'function' ? cb : undefined;
    let publisher = this;

    let Module = ml.load(publisher.moduleFileName);
    let pubModule = new Module({
      model: publisher,
      testMode: publisher.testMode || false
    });

    data.sender = data.sender || publisher.sender;

    pubModule.send(data, {}, (err, sendData) => {
      console.log(err || sendData);

      if (err && cb) return cb(err);

      if (options && options.saveDetails === true) {
        publisher.details.create(data);
      }

      cb && cb(null, data);
    });
  };

  AppPublisher.prototype.publish = function (data = {}, cb) {
    let appPublisher = this;

    if (!Array.isArray(data.receiver)) {
      return appPublisher.send(data, cb);
      // return appPublisher.details.create(data, cb);
    }

    let task = data.receiver.map(p => function (callback) {
      data.userId = p;

      appPublisher.send(data, callback);
      // appPublisher.details.create(data, callback);
    });

    async.parallel(task, cb);
  };

  AppPublisher.remoteMethod(
      'publish', {
        isStatic: false,
        description: 'Publish message to subscribers.',
        http: {path: '/publish', verb: 'post'},
        accepts: [
          {arg: 'data', type: 'PublishDetail', required: true, http: {source: 'body'}}
        ],
        returns: {arg: 'result', type: ['PublishDetail'], root: true, description: 'Return published message.'}
      }
  );

};
