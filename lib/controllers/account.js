'use strict';

var CollectionController = require('./controller-collection');
var ViewAccount = require('../views/account');


class ControllerAccount extends CollectionController {

  constructor(contacts, templates, container, extraData) {
    super(contacts, templates, container, extraData);

    this._initView();
  }

  _initView() {
    if (!this._view) {
      this._view = new ViewAccount(this._container, this._templates, {
      });
    }
  }

}

module.exports = ControllerAccount;
