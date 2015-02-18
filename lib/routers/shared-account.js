'use strict';

var RouterShared = require('./shared');
var ControllerAccount = require('../controllers/account');
var importFromGoogle = require('../../auth').importFromGoogle;

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
      case route==='importgo':
        importFromGoogle(this._ctrlr.getModel()).then((models) => {
          this._ctrlr.add(models);
        });
        return true;
    }
  }
}

module.exports = RouterSharedAccount;
