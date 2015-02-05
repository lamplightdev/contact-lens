'use strict';

var Controller = require('./controller');
var Collection = require('../models/collection');

class CollectionController extends Controller {

  constructor(model, templates) {
    if (model instanceof Collection) {
      super(model, templates);
    } else {
      super(new Collection(model), templates);
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
