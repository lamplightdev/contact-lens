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

  static getStorageModel() {
    return StorageModel;
  }
}

module.exports = ModelUser;
