'use strict';

var ControllerContacts = require('../controllers/contacts');


class RouterContacts {

  constructor() {
  }

  match(route, data, onMatched, onUnmatched) {
    route = route || '';
    route = route.replace(/\/$/, '').trim().toLowerCase();
    var routeParts = route.split('/');
    console.log(route, routeParts);

    var ctrlr = new ControllerContacts(data.contacts, data.templates, data.container, {
        _csrf: data._csrf
    });

    var matched = false;

    switch(true) {
      // /contacts
      case route==='':
        matched = true;
        break;

      // /contacts/add
      case /^add$/.test(route):
        ctrlr.addContact(true);
        matched = true;
        break;

      // /contacts/edit/:id
      case /^edit\/[0-9a-f]+$/.test(route):
        var toEdit = ctrlr.edit(routeParts[1]);
        if (toEdit) {
          matched = true;
        }
        break;

      // /contacts/search
      case /^search$/.test(route):
        if (data.query.q) {
            ctrlr.search(data.query.q);
        }
        matched = true;
        break;

      // /contacts/:id
      case /^[0-9a-f]+$/.test(route):
        let toSelect = ctrlr.select(route);
        if (toSelect) {
          matched = true;
        }
        break;
    }

    if (matched) {
      if (onMatched) {
        onMatched(ctrlr);
      }
    } else {
      if (onUnmatched) {
        onUnmatched();
      }
    }
  }
}

module.exports = RouterContacts;
