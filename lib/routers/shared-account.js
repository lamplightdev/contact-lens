'use strict';

var RouterShared = require('./shared');
var ControllerAccount = require('../controllers/account');

class RouterSharedAccount extends RouterShared {

  initController() {
    return new ControllerAccount(this._data.user, this._data.templates, this._data.container, {
    }, this._callbacks);
  }

  getMatched(route, routeParts, query) {

    switch(true) {
      case route==='':
        return true;
      case route==='import':
        return true;
    }
  }
}

module.exports = RouterSharedAccount;
