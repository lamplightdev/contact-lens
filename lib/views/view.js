'use strict';

var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime");

class View {

  constructor(templates, container) {
    this._setTemplates(templates);
    this._setContainer(container);
  }

  _setTemplates(templates) {
    this._templates = templates;
  }

  _getTemplate(name) {
    return this._templates[name];
  }

  _setContainer(container) {
    this._container = container;
  }

  render(name, data, preRendered, postRender) {
    if (!preRendered) {
      var compiled = Handlebars.template(this._getTemplate(name));
      this._container.innerHTML = compiled(data);
    }

    if (postRender) {
      postRender();
    }
  }

  renderPart(name, data, postRender) {
    var compiled = Handlebars.template(this._getTemplate(name));
    this._container.querySelector('.' + name).innerHTML = compiled(data);

    if (postRender) {
      postRender();
    }
  }
  /*
  constructor(router, templates, viewContainer, ctrlr, alreadyRendered, preRendered) {
    this.router = router;
    this.templates = templates;
    this.ctrlr = ctrlr;

    if (!alreadyRendered) {
      if (!preRendered) {
        this.ctrlr.render(viewContainer);
      } else if(this.ctrlr.view.postRender) {
        this.ctrlr.view.postRender();
      }
    }
  }
  */
}

module.exports = View;
