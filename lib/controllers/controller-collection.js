'use strict';

var Controller = require('./controller');
var Collection = require('../models/collection');

class CollectionController extends Controller {

  constructor(model, templates, container, extraData) {
    if (model instanceof Collection) {
      super(model, templates, container, extraData);
    } else {
      super(new Collection(model), templates, container, extraData);
    }
  }

  getCollection() {
    return this._model;
  }

  add(model) {
    this._model.add(model);
  }

  remove(model) {
    this._model.remove(model);
  }
}

module.exports = CollectionController;
