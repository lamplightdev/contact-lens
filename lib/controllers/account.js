'use strict';

var Controller = require('./controller');
var ViewAccount = require('../views/account');


class ControllerAccount extends Controller {

  constructor(user, templates, container, extraData, router) {
    super(user, templates, container, extraData, router);

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
