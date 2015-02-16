'use strict';

var Collection = require('./collection');
var ModelName = 'model';
var StorageModel = require('./storage/model');

class Model {

  constructor(members, publicKeys) {

    this._members = members || {};
    this._publicKeys = publicKeys || ['_id'];

    this.getStorageInfo();

  }

  getStorageInfo() {
    this._name = ModelName;
    // Storage will only be a function(class) in node (otherwise browserify will stub it out with a {})
    if (typeof StorageModel === 'function') {
      this._storage = new StorageModel();
    }
  }

  save() {
    this._storage.constructor(this._members);

    return this._storage.saveAsync().then((saved) => {
      this.setID(saved._id);

      return this;
    }, (err) => {
      Error(err);
    });
  }

  sync() {
    if (this._storage) {  //in server environment
      this._storage.constructor(this._members);

      return this._storage.constructor.findById(this.getID())
        .exec()
        .then((doc) => {
          if (doc) {
            return this._storage.constructor.update({
              _id: this.getID()
            }, this.getMembers())
            .exec();
          } else {
            return this._storage.saveAsync().then((saved) => {
              this.setID(saved._id);
            }).catch((err) => {
              Error(err);
            });
          }
        }, (err) => {
          Error(err);
        });
    } else {
      console.log('client sync');
    }
  }

  delete() {
    return this.deleteByID(this.getID());
  }

  deleteByID(id) {
    return this._storage.removeAsync(id);
  }

  static insert(rawModels) {
    return this.getStorageModel().create(rawModels)
      .then((...results) => {
        return this.fromJSON(results.map(result => result.toJSON()));
      });
  }

  static load(sort = 'name') {
    var query = this.getStorageModel()
      .find();

    if (sort) {
      query = query.sort(sort);
    }

    query = query.lean();

    return query
      .exec()
      .then((results) => {
        let coll = new Collection(this.fromJSON(results));
        return coll;
      }, (error) => {
        console.log('load error: ', error);
        Error(error);
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

  static search(field, value) {
    var find = {};
    find[field] = new RegExp("\\b" + value, "i");
    return this.getStorageModel()
      .find(find)
      .sort('name')
      .lean()
      .exec()
      .then((results) => {
        return new Collection(this.fromJSON(results));
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

  // need to be able to get StorageModel in a static context
  // (we can get the StorageModel in this._storage otherwise)
  static getStorageModel() {
    return StorageModel;
  }

  static getModelName() {
    return ModelName;
  }
}


module.exports = Model;
