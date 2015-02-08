'use strict';

class Model {

  constructor(name, members, publicKeys) {
    this._members = members;
    this._publicKeys = publicKeys || [];

    if (typeof window === 'undefined') {
      var StorageModel = require('./storage/' + name);
      this._storage = new StorageModel(members);
      this._storage.save();
    }
  }

  toJSON() {
    var json = {};
    Object.keys(this._members).forEach((name) => {
      if (this._publicKeys.indexOf(name) > -1) {
        json[name] = this._members[name];
      }
    });

    return json;
  }

  static fromJSON(json) {
    if (Array.isArray(json)) {
      return this.fromJSONArray(json);
    } else {
      return new this(json);
    }
  }

  static fromJSONArray(jsonArray) {
    var models = [];

    jsonArray.forEach((json => {
      models.push(this.fromJSON(json));
    }));

    return models;
  }

  getID() {
    return this._members.id;
  }
}


module.exports = Model;
