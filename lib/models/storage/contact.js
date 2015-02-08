var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({
    name: String,
    email: String,
});


var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
