'use strict';

var View = require('../views/view');

class Controller {

  constructor(model, templates, container, extraData, callbacks) {
    this._model = model;
    this._templates = templates || [];
    this._container = container;
    this._extraData = extraData;
    this._callbacks = callbacks || {};

    this._view = null;
  }

  _getViewData() {
    return {
      model: this._model ? this._model.toJSON() : this._model,
      extra: this._extraData
    };
  }

  initView() {
    if (!this._view) {
      this._view = new View(this._container, this._templates, {
        onContactSearched: (query) => {
          this.actionSearch(query);

          if (this._callbacks.onContactSearched) {
            this._callbacks.onContactSearched(query);
          }
        },
      });
    }
  }

  getModel() {
    return this._model;
  }

  setModel(model) {
    this._model = model;
  }

  renderView(preRendered) {
    this._initView();

    this._view.render(this._getViewData(), preRendered);
  }
}

module.exports = Controller;
