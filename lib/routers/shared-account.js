'use strict';

var RouterShared = require('./shared');
var ModelContact = require('../models/contact');
var ControllerAccount = require('../controllers/account');
var request = require('then-request');


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
        var user = this._ctrlr.getModel();

        return res.redirect('/auth/signin/google/import');
      case this._route==='importtest':
        return true;
        /*

        if (user.getID()) {
          var url = 'https://www.google.com/m8/feeds/contacts/default/full';

          var params = {
            alt: 'json',
            'max-results': 100,
            orderby: 'lastmodified',
          };

          var headers = {
            'Authorization': 'Bearer ' + user.getToken(),
          };

          return request.get({
            url: url,
            qs: params,
            headers: headers,
            json: true,
          }, function (e, r, result) {
            var raw = [];
            console.log(url, params, headers, result);
            result.feed.entry.forEach(function(contact) {
              if (contact.title.$t) {
                raw.push({
                  name: contact.title.$t,
                  email: contact.gd$email && contact.gd$email[0] ? contact.gd$email[0].address : null,
                  phone: contact.gd$phoneNumber && contact.gd$phoneNumber[0] ? contact.gd$phoneNumber[0].$t : null,
                  address: contact.gd$postalAddress && contact.gd$postalAddress[0] ? contact.gd$postalAddress[0].$t : null,
                });
              }
            });
            return ModelContact.insert(raw).then((models) => {
              this.ctrlr.add(models);
              return true;
            });
          });
        } else {
          return true;
        }
        */
        break;
    }
  }
}

module.exports = RouterSharedAccount;
