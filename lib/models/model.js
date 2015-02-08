'use strict';

class Model {

  constructor(name, members, publicKeys) {
    this._name = name;
    this._members = members;
    this._publicKeys = publicKeys || [];
  }

  sync() {
    if (typeof window === 'undefined') {
      var StorageModel = require('./storage/' + this._name);
      this._storage = new StorageModel(this._members);
      this._storage.save();
      console.log('server sync');
    } else {
      console.log('client sync');
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
