var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({
  name: String,
  emails: [
    String
  ],
  phone: String,
  address: String,
  provider: String,
  providerID: String,
  providerPhoto: String,
  avatar: { data: Buffer, contentType: String }
});

contactSchema.methods.saveAsync = function () {
  return new Promise((resolve,reject) => {
    this.save((err, saved) => {
      if(err) {
        reject(err);
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
        reject(err);
      }
      resolve(removed);
    });
  });
};

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
