'use strict';

module.exports = (Message) => {

  Message.getMessage = function(tags) {
    let filter = {where: {tags: {inq: tags}}};

    return Message.app.models.Message.findOne(filter);
  };

  Message.getAcceptMessage = function() {
    let tags = ['accept_invite'];

    return Message.getMessage(tags);
  };

  Message.getTeamInviteMessage = function() {
    let tags = ['new_team_invite'];

    return Message.getMessage(tags);
  };

  Message.prototype.transform = function(data) {
    if (!this.body) return this;

    Object.keys(data).forEach(key => {
      let pattern = new RegExp(`{${key}}`, 'g');

      this.body = this.body.replace(pattern, data[key]);
    });

    return Promise.resolve(this);
  };

  Message.uploadImage = function(param, cb) {
    cb && cb(null, param);
  };

  Message.remoteMethod('uploadImage', {
        isStatic: true,
        description: 'Upload image',
        http: {path: '/uploadImage', verb: 'post'},
        accepts: [
          {arg: 'param', type: 'object', required: false, http: {source: 'body'}}
        ],
        returns: {arg: 'result', type: 'object', root: true, description: ''}
      }
  );

};
