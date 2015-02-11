'use strict';

class Collection {

  constructor(models) {
    this._models = models || [];
  }

  toJSON() {
    var json = [];

    this._models.forEach((model) => {
      json.push(model.toJSON());
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

  getModelByID(id) {
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

  update(model) {
    var toUpdate = this.getModelByID(model.getID());
    Object.assign(toUpdate, model);

    return this;
  }

  remove(modelToRemove) {
    this._models.forEach((model, index) => {
      if (model.getID() === modelToRemove.getID()) {
        this._models.splice(index, 1);
      }
    });

    return this;
  }

  find(field, term) {
    var matches = [];
    var re = new RegExp("\\b" + term, "i");

    this._models.forEach((model) => {
      if(re.test(model._members[field])) {
        matches.push(model);
      }
    });

    return matches;
  }
}

module.exports = Collection;
