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

  static findByID(id) {
    return this.getStorageModel().findById(id).lean().exec().then( (found) => {
      if (found) {
        return this.fromJSON(found);
      } else {
        throw new Error('model id not found');
      }
    }, (err) => {
      return Error(err);
    });
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

      return this._storage.constructor.findById(this.getID())
        .exec()
        .then((doc) => {
          if (doc) {
            Object.assign(doc, this.getMembers(true));
            return doc.saveAsync().then(() => {
              this._storage = doc;
              return this;
            });
          } else {
            Object.assign(this._storage, this.getMembers());
            return this._storage.saveAsync().then((saved) => {
              this.setID(saved._id);
              return this;
            });
          }
        });
    } else {
      console.log('client sync');
    }
  }

  delete() {
    return this.constructor.deleteByID(this.getID());
  }

  static deleteByID(id) {
    return this.getStorageModel()().removeAsync(id);
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

  getMembers(excludeID) {
    if (!excludeID) {
      return this._members;
    }

    let filtered = {};
    for (let member in this._members) {
      if (member !== '_id') {
        filtered[member] = this._members[member];
      }
    }
    return filtered;
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
