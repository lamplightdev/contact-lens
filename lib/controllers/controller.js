'use strict';

class Controller {

  constructor(model, templates, container, extraData) {
    this._model = model;
    this._templates = templates;
    this._container = container;
    this._extraData = extraData;
  }

  _getViewData() {
    return {
      model: this._model.toJSON(),
      extra: this._extraData
    };
  }

  getModel() {
    return this._model;
  }
}
/*
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
    componentHandler.upgradeAllRegistered();
  }

  renderPart(templatePart, view, postRender) {
    var template = Handlebars.template(templatePart);
    view.innerHTML = template(this.getViewData());

    if (postRender) {
      postRender();
    }
    componentHandler.upgradeAllRegistered();
  }
}
*/

module.exports = Controller;
