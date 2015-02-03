'use strict';

var View = require("./view");

class ViewAccount extends View {
  constructor(router, templates, viewContainer, ctrlr, alreadyRendered, preRendered) {
    super(router, templates, viewContainer, ctrlr, alreadyRendered, preRendered);
  }
}

module.exports = ViewAccount;
