'use strict';

var ModelContact = require('../lib/models/contact');

module.exports = function exposeContacts() {

  return function (req, res, next) {
    ModelContact.load().then(function (collection) {
      res.locals.contacts = collection;
      res.expose(collection.toJSON(), 'Data.contacts');

      next();
    }, function (error) {
      console.log('exposeContacts load error: ', error);
      next(error);
    });
  };
};
