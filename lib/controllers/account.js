'use strict';

var Controller = require('./controller');
var ViewAccount = require('../views/account');

class ControllerAccount extends Controller {

  _initView() {
    if (!this._view) {
      this._view = new ViewAccount(this._templates, this._container, {
      });
    }
  }

  renderView(preRendered) {
    this._initView();

    this._view.render(this._getViewData(), preRendered);
  }

  account(preRendered) {
    this._initView();

    this._view.render('account', this._getViewData(), preRendered);
  }

}

module.exports = ControllerAccount;
