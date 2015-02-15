'use strict';

var Model = require('./model');
var StorageModel = require('./storage/user');

class ModelUser extends Model {

  constructor(members) {
    super('user', StorageModel, members, [
      '_id',
      'name',
    ]);
  }

  static findByProvider(provider, providerID) {
    var find = {
      provider: provider,
      providerID: providerID,
    };

    return this.getStorageModel()
      .findOne(find)
      .exec()
      .then((found) => {
        return found;
      });
  }

  static load(userId) {
    return super.load(userId, 'user');
  }

  static fromJSON(json) {
    return super.fromJSON(json, 'user', StorageModel);
  }

  // need to be able to get StorageModel in a static context
  // (we can get the StorageModel in this._storage otherwise)
  static getStorageModel() {
    return StorageModel;
  }
}

module.exports = ModelUser;
