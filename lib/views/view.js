'use strict';

var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime");
var request = require('then-request');

class View {

  constructor(templates, container, callbacks) {
    this._setTemplates(templates);
    this._setContainer(container);

    this._callbacks = callbacks || {};
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

  submitForm(form, method, action) {
    var data = {};
    for(let i=0; i<form.elements.length; i++) {
        data[form.elements[i].name] = form.elements[i].value;
    }

    method = method || form.method;
    action = action || form.dataset.apiAction || form.action;

    return request(method, action, {
        json: data
    }).then((res) => {
      return JSON.parse(res.getBody());
    }).catch(() => {
      return;
    });
  }
}

module.exports = View;
