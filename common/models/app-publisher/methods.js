'use strict';

const async = require('async');

const error = require('../../../loopbacker/src/common/utils/error-provider');

module.exports = function(AppPublisher) {

  AppPublisher.defaultPublish2 = function(type, details, cb) {
    AppPublisher.findOne({where: {type: type}}).then(pub => {
      if (!pub) return error.notFound();

      return pub.publish(details, cb);
    });
  };

  AppPublisher.defaultPublish = function(type, message, to, userId, cb) {
    AppPublisher.findOne({where: {type: type}}).then(pub => {
      if (!pub) return error.notFound();

      return pub.defaultPublish(message, to, userId, cb);
    });
  };

  AppPublisher.prototype.defaultPublish = function(message, to, userId, cb) {
    let data = {
      'message': message,
      'type': 'info',
      'dataType': 'plain',
      'receiver': to,
      'iconUrl': undefined,
      'isRead': false,
      'userId': userId,
    };

    this.publish(data, cb);
  };

  AppPublisher.prototype.publish = function(data = {}, cb) {
    let appPublisher = this;
    let to = data.receiver || data.to;

    if (!Array.isArray(to)) {
      return appPublisher.details.create(data, cb);
    }

    let task = to.map(p => function(callback) {
      data.userId = p;

      appPublisher.details.create(data, callback);
    });

    async.parallel(task, cb);
  };

  AppPublisher.remoteMethod(
    'publish', {
      isStatic: false,
      description: 'Publish message to subscribers.',
      http: {path: '/publish', verb: 'post'},
      logger: {
        info: 'publish An Agent.',
      },
      accepts: [
        {
          arg: 'data',
          type: 'PublishDetail',
          required: true,
          http: {source: 'body'},
        },
      ],
      returns: {
        arg: 'result',
        type: ['PublishDetail'],
        root: true,
        description: 'Return published message.',
      },
    },
  );

};
