'use strict';

class Model {

  constructor(members, publicKeys) {
    this._members = members;
    this._publicKeys = publicKeys || [];
  }

  toJSON() {
    var json = {};

    Object.keys(this._members).forEach(function (value, name) {
      if (this._publicKeys.indexOf(name) > -1) {
        json[name] = value;
      }
    });

    return json;
  }

  getID() {
    return this._members.id;
  }
}


module.exports = Model;
