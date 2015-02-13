var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  provider: String,
  providerID: String,
  token: String,
  refreshToken: String,
});

userSchema.methods.saveAsync = function () {
  return new Promise((resolve,reject) => {
    this.save((err, saved) => {
      if(err) {
        reject(err);
      }
      resolve(saved);
    });
  });
};

userSchema.methods.removeAsync = function (id) {
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

var User = mongoose.model('User', userSchema);

module.exports = User;
