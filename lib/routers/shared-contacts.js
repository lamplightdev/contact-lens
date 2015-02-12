'use strict';

var RouterShared = require('./shared');
var ControllerContacts = require('../controllers/contacts');


class RouterSharedContacts extends RouterShared {

  getController() {
    return new ControllerContacts(this._data.contacts, this._data.templates, this._data.container, {
        _csrf: this._data._csrf
    }, this._parentRouter);
  }

  getMatched() {
    var matched = false;

    switch(true) {
      // /contacts
      case this._route==='':
        this._ctrlr.actionAdd(null);
        this._ctrlr.actionEdit(null);
        this._ctrlr.actionSelect(null);
        matched = true;
        break;

      // /contacts/add
      case /^add$/.test(this._route):
        this._ctrlr.actionAdd(true);
        this._ctrlr.actionSelect(null);
        matched = true;
        break;

      // /contacts/edit/:id
      case /^edit\/[0-9a-f]+$/.test(this._route):
        var toEdit = this._ctrlr.actionEdit(this._routeParts[1]);
        if (toEdit) {
          matched = true;
        }
        this._ctrlr.actionSelect(null);
        break;

      // /contacts/search
      case /^search$/.test(this._route):
        if (this._query.q) {
            this._ctrlr.actionSearch(this._query.q);
            if (this._parentRouter) {
              this._parentRouter.update('/contacts/search?q=' + this._query.q);
            }
        }
        matched = true;
        break;

      // /contacts/:id
      case /^[0-9a-f]+$/.test(this._route):
        this._ctrlr.actionAdd(null);
        this._ctrlr.actionEdit(null);
        let toSelect = this._ctrlr.actionSelect(this._route);
        if (toSelect) {
          matched = true;
        }
        break;
    }

    return matched;
  }
}

module.exports = RouterSharedContacts;
