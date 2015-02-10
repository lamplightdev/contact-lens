'use strict';

var ModelContact = require('../lib/models/contact');

module.exports = function exposeContacts() {

  return function (req, res, next) {
    ModelContact.load().then(function (collection) {
      res.locals.contacts = collection;
      res.expose({
        contacts: collection.toJSON(),
        _csrf: res.locals._csrf
      }, 'Data');

      next();
    }, function (error) {
      console.log('exposeContacts load error: ', error);
      next(error);
    });
  };
};
