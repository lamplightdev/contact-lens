'use strict';

var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime");

class Controller {

  constructor(template, data, postRender) {
    this.view = {
      template: template || null,
      data: data || {},
      postRender: postRender || null
    };
  }

  getViewData() {
    return this.view.data;
  }

  render(view) {
    var template = Handlebars.template(this.view.template);
    view.innerHTML = template(this.getViewData());

    if (this.view.postRender) {
      this.view.postRender();
    }
  }

  renderPart(templatePart, view, postRender) {
    var template = Handlebars.template(templatePart);
    view.innerHTML = template(this.getViewData());

    if (postRender) {
      postRender();
    }
  }
}

module.exports = Controller;
