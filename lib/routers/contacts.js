'use strict';

var ControllerContacts = require('../controllers/contacts');


class RouterContacts {

  constructor() {
  }

  match(route, data, onMatched, onUnmatched) {
    route = route || '';

    var ctrlr = new ControllerContacts(data.contacts, data.templates, data.container, {
        _csrf: data._csrf
    });

    var match = false;

    switch(route.replace(/\/$/, '')) {
      case '':
        match = true;
        break;
    }

    if (match) {
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
