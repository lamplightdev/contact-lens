'use strict';

var Controller = require('./controller');
var Collection = require('../models/collection');

class CollectionController extends Controller {

  constructor(model) {
    if (model instanceof Collection) {

    } else {
      super(new Collection(model));
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
