var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({
    name: String,
    email: String,
});

contactSchema.methods.saveAsync = function() {
  return new Promise((resolve,reject) => {
    this.save((err, saved) => {
      if(err) {
        return reject(err);
      }
      resolve(saved);
    });
  });
};

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
