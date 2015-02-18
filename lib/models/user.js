'use strict';

var Model = require('./model');
var ModelName = 'user';
var StorageModel = require('./storage/user');

class ModelUser extends Model {

  constructor(members) {
    super(members, [
      '_id',
      'name',
      'email',
      'provider',
      'providerID',
      'token',
    ]);
  }

  getStorageInfo() {
    this._name = ModelName;
    // Storage will only be a function(class) in node (otherwise browserify will stub it out with a {})
    if (typeof StorageModel === 'function') {
      this._storage = new StorageModel();
    }
  }

  getToken() {
    return this._members.token;
  }

  getEmail() {
    return this._members.email;
  }

  setToken(token) {
    this._members.token = token;
  }

  static findByProvider(provider, providerID) {
    var find = {
      provider: provider,
      providerID: providerID,
    };

    return this.getStorageModel()
      .findOne(find)
      .lean()
      .exec()
      .then((found) => {
        return found;
      });
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

module.exports = ModelUser;
