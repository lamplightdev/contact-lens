'use strict';

var Model = require('./model');
var ModelName = 'contact';
var StorageModel = require('./storage/contact');

class ModelContact extends Model {

  constructor(members) {
    super(members, [
      '_id',
      'name',
      'emails',
      'phone',
      'address',
      'avatar',
    ]);
  }

  getStorageInfo() {
    this._name = ModelName;
    // Storage will only be a function(class) in node (otherwise browserify will stub it out with a {})
    if (typeof StorageModel === 'function') {
      this._storage = new StorageModel();
    }
  }

  getName() {
    return this._members.name;
  }

  getEmail(index) {
    return this._members.emails[index];
  }

  getAvatar() {
    return this._members.avatar;
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

  static insert(rawModels) {
    rawModels.forEach((data) => {
      this.findByProvider(data.provider, data.providerID).then((contact) => {
        if (contact) {
          this.update({
            _id: contact.getID()
          }, data)
          .exec();
        } else {
          contact = new this(data);
          contact.save();
        }
      });
    });
  }

  static getStorageModel() {
    return StorageModel;
  }

  static getModelName() {
    return ModelName;
  }
}

module.exports = ModelContact;
