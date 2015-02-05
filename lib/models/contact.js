'use strict';

var Model = require('./model');

class ModelContact extends Model {

  constructor(members) {
    super(members, [
      'id',
      'name'
    ]);
  }

  getName() {
    return this._members.name;
  }
}

module.exports = ModelContact;
