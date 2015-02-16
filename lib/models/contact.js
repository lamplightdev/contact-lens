'use strict';

var Model = require('./model');
var ModelName = 'contact';
var StorageModel = require('./storage/contact');

class ModelContact extends Model {

  constructor(members) {
    super(members, [
      '_id',
      'name',
      'email',
      'address',
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

  getEmail() {
    return this._members.email;
  }

  static getStorageModel() {
    return StorageModel;
  }

  static getModelName() {
    return ModelName;
  }
}

module.exports = ModelContact;
