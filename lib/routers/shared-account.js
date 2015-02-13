'use strict';

var RouterShared = require('./shared');
var ControllerAccount = require('../controllers/account');


class RouterSharedAccount extends RouterShared {

  getController() {
    return new ControllerAccount(this._data.user, this._data.templates, this._data.container, {
    }, this._parentRouter);
  }

  getMatched() {
    var matched = false;

    switch(true) {
      case this._route==='':
        matched = true;
        break;
      case this._route==='import':
        matched = true;
        break;
    }

    return matched;
  }
}

module.exports = RouterSharedAccount;
