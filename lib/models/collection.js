'use strict';

class Collection {

  constructor(models) {
    this._models = models || [];
  }

  toJSON() {
    var json = [];

    this._models.forEach((model) => {
      json.push(model.toJSON);
    });

    return json;
  }

  getIndex(modelToFind) {
    var indexFound;

    this._models.forEach((model, index) => {
      if (model === modelToFind) {
        indexFound = index;
      }
    });

    return indexFound;
  }

  getModelById(id) {
    var modelFound;

    this._models.forEach((model) => {
      if (model.getID() === id) {
        modelFound = model;
      }
    });

    return modelFound;
  }

  add(model) {
    this._models.push(model);

    return this;
  }

  remove(modelToRemove) {
    this._models.forEach((model, index) => {
      if (model.getID() === modelToRemove.getID()) {
        this._collection.splice(index, 1);
      }
    });

    return this;
  }
}

module.exports = Collection;
