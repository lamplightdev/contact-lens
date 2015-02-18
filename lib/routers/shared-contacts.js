'use strict';

var RouterShared = require('./shared');
var ControllerContacts = require('../controllers/contacts');


class RouterSharedContacts extends RouterShared {

  initController() {
    return new ControllerContacts(this._data.contacts, this._data.templates, this._data.container, {
        _csrf: this._data._csrf
    }, this._callbacks);
  }

  getMatched(route, routeParts, query) {
    var matched = false;

    switch(true) {
      // /contacts
      case route==='':
        this._ctrlr.actionAdd(null);
        this._ctrlr.actionEdit(null);
        this._ctrlr.actionSelect(null);
        matched = true;
        break;

      // /contacts/add
      case /^add$/.test(route):
        this._ctrlr.actionAdd(true);
        this._ctrlr.actionSelect(null);
        matched = true;
        break;

      // /contacts/edit/:id
      case /^edit\/[0-9a-f]+$/.test(route):
        var toEdit = this._ctrlr.actionEdit(routeParts[1]);
        if (toEdit) {
          matched = true;
        }
        this._ctrlr.actionSelect(null);
        break;

      // /contacts/search
      case /^search$/.test(route):
        if (query.q) {
            this._ctrlr.actionSearch(query.q);
        }
        matched = true;
        break;

      // /contacts/:id
      case /^[0-9a-f]+$/.test(route):
        this._ctrlr.actionAdd(null);
        this._ctrlr.actionEdit(null);
        let toSelect = this._ctrlr.actionSelect(route);
        if (toSelect) {
          matched = true;
        }
        break;
    }

    return matched;
  }
}

module.exports = RouterSharedContacts;
