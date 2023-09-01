'use strict';

module.exports = function(Model, options = {}) {
  const methods = {
    'create': {
      meta: {
        title: 'Create new {model}',
        subtitle: 'Create a new instance of the {model}.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
    'patchOrCreate': {
      meta: {
        title: 'Update or Create new {model}',
        subtitle: 'Update or Create a new instance of the {model}.',
        permission: {},
        auditLog: {},
        userLog: {}
      }
    },
    'replaceOrCreate': {
      meta: {
        title: 'Update or Create new {model}',
        subtitle: 'Update or Create a new instance of the {model}.',
        permission: {},
        auditLog: {},
        userLog: {}
      }
    },
    'upsertWithWhere': {
      meta: {
        title: 'Update new {model}',
        subtitle: 'update an {model} item.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
    'exists': {
      meta: {
        title: 'Check {model} exists.',
        subtitle: 'Check whether a {model} instance exists.',
        permission: {},
        auditLog: false,
        userLog: false
      },
    },
    'findById': {
      meta: {
        title: 'Find {model}',
        subtitle: 'Find a {model} instance by {{id}}.',
        permission: {},
        auditLog: false,
        userLog: false
      },
    },
    'replaceById': {
      meta: {
        title: 'update {model}',
        subtitle: 'update an {model} item.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
    'find': {
      meta: {
        title: 'Find all {model} models.',
        subtitle: 'Find all {model} matched by filter.',
        permission: {},
        auditLog: false,
        userLog: {}
      },
    },
    'findOne': {
      meta: {
        title: 'Find first {model}',
        subtitle: 'Find first {model} matched by filter.',
        permission: {},
        auditLog: false,
        userLog: false
      },
    },
    'destroyAll': {
      meta: {
        title: 'Delete all {model} models.',
        subtitle: 'Delete all {model} matched by filter.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
    'updateAll': {
      meta: {
        title: 'Update all {model} models.',
        subtitle: 'Update all {model} matched by filter.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
    'deleteById': {
      meta: {
        title: 'Delete a {model} model.',
        subtitle: 'Delete a {model} instance by {{id}}.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
    'count': {
      meta: {
        title: 'Count {model} data.',
        subtitle: 'Count instances of the {model} matched by where.',
        permission: {},
        auditLog: false,
        userLog: false
      },
    },
    'patchAttributes': {
      meta: {
        title: 'Update {model}.',
        subtitle: 'Update attributes for a {model} instance.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
    'createChangeStream': {
      meta: {
        title: 'Create a change stream.',
        subtitle: 'Create a change stream.',
        permission: {},
        auditLog: {},
        userLog: {}
      },
    },
  };

  String.prototype.transform = function(data) {
    let value = this;
    if (!value) return value;

    Object.keys(data).forEach(key => {
      let pattern = new RegExp(`{${key}}`, 'g');
      value = value.replace(pattern, data[key]);
    });

    return value;
  };

  Model.sharedClass.methods()
    .filter(m => !m.meta && Object.keys(methods).indexOf(m.name) >= 0)
    .forEach(m => {
      let meta = methods[m.name] && methods[m.name].meta;

      if (meta) {
        let modelName = options.modelName || Model.modelName;
        meta.title = meta.title.transform({model: modelName});
        meta.subtitle = meta.subtitle.transform({model: modelName});
      }

      m.meta = meta;
    });

};

