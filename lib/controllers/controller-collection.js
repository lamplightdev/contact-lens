'use strict';

var Controller = require('./controller');
var Collection = require('../models/collection');

class CollectionController extends Controller {

  constructor(models, templates, container, extraData) {
    if (models instanceof Collection) {
      super(models, templates, container, extraData);
    } else {
      super(new Collection(models), templates, container, extraData);
    }
  }

  getCollection() {
    return this._model;
  }

  add(model) {
    if (!Array.isArray(model)) {
      model = [model];
    }

    model.forEach((m) => {
      this._model.add(m);
    });
  }

  update(model) {
    this._model.update(model);
  }

  remove(model) {
    return this._model.remove(model);
  }

  removeByID(id) {
    this.remove(this._model.getModelByID(id));
  }
}

module.exports = CollectionController;
