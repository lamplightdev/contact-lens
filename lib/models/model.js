'use strict';

var Collection = require('./collection');

class Model {

  constructor(name, members, publicKeys) {
    this._name = name;
    this._members = members;
    this._publicKeys = publicKeys || [];
  }

  sync() {
    if (typeof window === 'undefined') {
      console.log('server sync');

      var StorageModel = require('./storage/' + this._name);
      this._storage = new StorageModel(this._members);

      return StorageModel.findById(this.getID())
        .exec()
        .then((doc) => {
          if (doc) {
            return StorageModel.update({
              _id: this.getID()
            }, this.getMembers())
            .exec();
          } else {
            return this._storage.saveAsync().then((saved) => {
              this.setID(saved._id);
            }).catch((err) => {
              console.log('save error', err);
            });
          }
        }, (err) => {
          console.log('sync error', err);
        });

    } else {
      console.log('client sync');
    }
  }

  static load(userId, name) {
    var StorageModel = require('./storage/' + name);
    return StorageModel
      .find()
      .lean()
      .exec()
      .then((results) => {
        return new Collection(this.fromJSON(results));
      }, (error) => {
        console.log('load error: ', error);
      });
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
    if (this._members._id) {
      return this._members._id.toString();
    } else {
      return null;
    }
  }

  setID(id) {
    this._members._id = id;
  }

  getMembers() {
    return this._members;
  }
}


module.exports = Model;
