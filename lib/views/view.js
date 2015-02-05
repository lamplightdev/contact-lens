'use strict';

var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime");

class View {

  constructor(template, data, container, extraData, postRender) {
    this._setTemplate(template);

    if (extraData) {
      for (let key in extraData) {
        data[key] = extraData[key];
      }
    }

    this._setData(data);
    this._setContainer(container);
    this._setPostRender(postRender);
  }

  _setTemplate(template) {
    this._template = template;
  }

  _setData(data) {
    this._data = data;
  }

  _setContainer(container) {
    this._container = container;
  }

  _setPostRender(postRender) {
    this._postRender = postRender;
  }

  render() {
    var compiled = Handlebars.template(this._template);
    this._container.innerHTML = compiled(this._data);

    if (this._postRender) {
      this._postRender();
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
