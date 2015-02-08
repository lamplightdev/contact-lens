'use strict';

var Model = require('./model');

class ModelContact extends Model {

  constructor(members) {
    super('contact', members, [
      'id',
      'name',
      'email',
    ]);
  }

  getName() {
    return this._members.name;
  }

  getEmail() {
    return this._members.email;
  }
}

module.exports = ModelContact;
