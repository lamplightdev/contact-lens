'use strict';

var Model = require('./model');

class ModelContact extends Model {

  constructor(members) {
    super('contact', members, [
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
}

module.exports = ModelContact;
