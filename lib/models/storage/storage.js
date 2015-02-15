var mongoose = require('mongoose');

class Storage {
  constructor(fields, name) {
    this._schema = mongoose.Schema(fields);
    this._name = name;

    this._schema.methods.saveAsync = function () {
      return new Promise((resolve,reject) => {
        this.save((err, saved) => {
          if(err) {
            return reject(err);
          }
          resolve(saved);
        });
      });
    };

    this._schema.methods.removeAsync = function (id) {
      return new Promise((resolve, reject) => {
        this.constructor.where().findOneAndRemove({
            _id: id
          }, (err, removed) => {
          if (err) {
            return reject(err);
          }
          resolve(removed);
        });
      });
    };
  }

  getStorage() {
    return mongoose.model(this._name, this._schema);
  }
}

module.exports = new Storage({}, 'Storage').getStorage();
