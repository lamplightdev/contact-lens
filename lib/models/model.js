'use strict';

var Collection = require('./collection');

class Model {

  constructor(name, storage, members, publicKeys) {
    this._name = name;
    this._storage = storage;
    this._members = members || {};
    this._publicKeys = publicKeys || [];
  }

  save() {
    this._storage = new this.getStorageModel()(this._members);

    return this._storage.constructor.saveAsync().then((saved) => {
      this.setID(saved._id);

      return this;
    });
  }

  sync() {
    if (typeof window === 'undefined') {
      console.log('server sync');

      var storage = new this._storage(this._members);

      return storage.constructor.findById(this.getID())
        .exec()
        .then((doc) => {
          if (doc) {
            return storage.constructor.update({
              _id: this.getID()
            }, this.getMembers())
            .exec();
          } else {
            return storage.saveAsync().then((saved) => {
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

  delete() {
    return this.deleteByID(this.getID());
  }

  deleteByID(id) {
    if (typeof window === 'undefined') {
      console.log('server model remove');

      return new this._storage().removeAsync(id);

    } else {
      console.log('client model remove');
    }
  }

  static insert(rawModels) {
    return this.getStorageModel().create(rawModels)
      .then((...results) => {
        return this.fromJSON(results.map(result => result.toJSON()));
      });
  }

  static load() {
    return this.getStorageModel()
      .find()
      .sort('name')
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

  search(field, value) {
    var find = {};
    find[field] = new RegExp("\\b" + value, "i");
    return this._storage
      .find(find)
      .sort('name')
      .lean()
      .exec()
      .then((found) => {
        var models = [];
        found.forEach((model) => {
          models.push(new this.constructor(model));
        });
        return new Collection(models);
      });
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
