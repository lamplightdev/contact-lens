'use strict';

var Model = require('./model');
var StorageModel = require('./storage/contact');

class ModelContact extends Model {

  constructor(members) {
    super('contact', StorageModel, members, [
      '_id',
      'name',
      'email',
      'address',
    ]);
  }

  static load(userId) {
    return super.load(userId, 'contact');
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
}

module.exports = ModelContact;
