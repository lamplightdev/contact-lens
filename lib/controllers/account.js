'use strict';

var Controller = require('./controller');

class ControllerAccount extends Controller {

  constructor(template, data, postRender) {
    super(template, data, postRender);
  }
}

module.exports = ControllerAccount;
