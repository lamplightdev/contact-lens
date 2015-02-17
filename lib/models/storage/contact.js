var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

contactSchema.methods.saveAsync = function () {
  return new Promise((resolve,reject) => {
    this.save((err, saved) => {
      if(err) {
        return reject(err);
      }
      resolve(saved);
    });
  });
};

contactSchema.methods.removeAsync = function (id) {
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

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
