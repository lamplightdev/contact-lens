'use strict';

class Controller {

  constructor(model, templates, container, extraData) {
    this._model = model;
    this._templates = templates;
    this._container = container;
    this._extraData = extraData;

    this._currentView = null;
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

  renderView(preRendered) {
    this._initView();

    this._currentView.render(this._getViewData(), preRendered);
  }
}

module.exports = Controller;
