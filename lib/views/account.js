'use strict';

var View = require("./view");

class ViewAccount extends View {
  constructor(templates, container, callbacks) {
    super(templates, container, callbacks);
  }

  render(data, preRendered) {
    super.render('account', data, preRendered, () => {
    });
  }
}

module.exports = ViewAccount;
