'use strict';

var Controller = require('./controller');
var ViewAccount = require('../views/account');

class ControllerAccount extends Controller {

  _initView() {
    if (!this._currentView) {
      this._currentView = new ViewAccount(this._templates, this._container, {
      });
    }
  }

  renderView(preRendered) {
    this._initView();

    this._currentView.render(this._getViewData(), preRendered);
  }

  account(preRendered) {
    this._initView();

    this._currentView.render('account', this._getViewData(), preRendered);
  }

}

module.exports = ControllerAccount;
