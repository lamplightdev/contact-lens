'use strict';

var RouterShared = require('./shared');
var ModelContact = require('../models/contact');
var ControllerAccount = require('../controllers/account');
var request = require('request');


class RouterSharedAccount extends RouterShared {

  getController() {
    return new ControllerAccount(this._data.user, this._data.templates, this._data.container, {
    }, this._parentRouter);
  }

  getMatched(res) {

    switch(true) {
      case this._route==='':
        return true;
      case this._route==='import':
        return res.redirect('/auth/signin/google/import');
      case this._route==='importgo':
        let user = this._ctrlr.getModel();

        let url = 'https://www.google.com/m8/feeds/contacts/default/full';

        let params = {
          alt: 'json',
          'max-results': 1000,
          orderby: 'lastmodified',
        };

        let headers = {
          'Authorization': 'Bearer ' + user.getToken(),
        };

        request.get({
          url: url,
          qs: params,
          headers: headers,
          json: true,
        }, function (e, r, result) {
          var raw = [];
          result.feed.entry.forEach(function(contact) {
            console.log(contact);
            if (contact.title.$t) {
              raw.push({
                name: contact.title.$t,
                email: contact.gd$email && contact.gd$email[0] ? contact.gd$email[0].address : null,
                phone: contact.gd$phoneNumber && contact.gd$phoneNumber[0] ? contact.gd$phoneNumber[0].$t : null,
                address: contact.gd$postalAddress && contact.gd$postalAddress[0] ? contact.gd$postalAddress[0].$t : null,
              });
            }
          });
          ModelContact.insert(raw).then((models) => {
            this.ctrlr.add(models);
          });
        });
        return true;
    }
  }
}

module.exports = RouterSharedAccount;
