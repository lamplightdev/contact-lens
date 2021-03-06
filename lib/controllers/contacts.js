'use strict';

var ModelContact = require('../models/contact');
var Collection = require('../models/collection');
var CollectionController = require('./controller-collection');
var ViewContacts = require('../views/contacts');


class ControllerContacts extends CollectionController {

  constructor(contacts, templates, container, extraData, callbacks) {
    super(contacts, templates, container, extraData, callbacks);

    this._initView();

    this._currentContact = null;
    this._editContact = null;

    this._search = null;
    this.resetSearch();

  }

  _getViewData() {
    var data = super._getViewData();

    if (this._currentContact) {
      data.currentContact = this._currentContact.toJSON();
    }

    if (this._editContact) {
      data.editContact = this._editContact.toJSON();
    }

    data.search = {
      active: this._search.active,
      query: this._search.query,
      results: this._search.results ? this._search.results.toJSON() : [],
    };

    return data;
  }

  _initView() {
    if (!this._view) {
      this._view = new ViewContacts(this._container, this._templates, {
        onContactSearched: (query) => {
          this.actionSearch(query);

          if (this._callbacks.onContactSearched) {
            this._callbacks.onContactSearched(query);
          }
        },
        onContactAdded: (result) => {
          var modelToAdd = new ModelContact(result);
          modelToAdd.sync();
          this.add(modelToAdd);

          this.list();

          if (this._callbacks.onContactAdded) {
            this._callbacks.onContactAdded(modelToAdd.getID());
          }
        },
        onContactRemoved: (id) => {
          this.removeByID(id);

          this.list();

          if (this._callbacks.onContactRemoved) {
            this._callbacks.onContactRemoved();
          }
        },
        onContactEdited: (result) => {
          var modelToEdit = new ModelContact(result);
          modelToEdit.sync();
          this.update(modelToEdit);

          this.list();

          if (this._callbacks.onContactEdited) {
            this._callbacks.onContactEdited(modelToEdit.getID());
          }
        },
      });
    }
  }

  list() {
    this._view.setDirty('contacts-list');
  }

  actionAdd(add) {
    if ( (!this._editContact && add) || (this._editContact && !add) ) {
      this._editContact = new ModelContact();
      this._view.setDirty('contacts-add');
    }
  }

  actionSelect(id) {
    if (id && (!this._currentContact || this._currentContact.getID() !== id)) {
      this._currentContact = this._model.getModelByID(id);
      this._view.setDirty('contacts-current');
    } else if(!id && this._currentContact) {
      this._currentContact = null;
      this._view.setDirty('contacts-current');
    }

    return this._currentContact;
  }

  actionEdit(id) {
    if (id && (!this._editContact || this._editContact.getID() !== id)) {
      this._editContact = this._model.getModelByID(id);
      this._view.setDirty('contacts-add');
    } else if(!id && this._editContact) {
      this._editContact = null;
      this._view.setDirty('contacts-add');
    }

    return this._editContact;
  }

  actionSearch(term) {
    var matches = new Collection(this._model.find('name', term));

    this.updateSearch(term, matches);

    return matches;
  }

  resetSearch() {
    if (!this._search || this._search.active) {
      this._search = {
        active: false,
        query: null,
        results: null,
      };
      this._view.setDirty('contacts-list');
    }
  }

  updateSearch(term, matches) {
    this._search = {
      active: true,
      query: term,
      results: matches,
    };
    this._view.setDirty('contacts-list');
  }

  searchDB(term) {
    return new ModelContact().search('name', term).then((matches) => {
      this.updateSearch(term, matches);

      return matches;
    });
  }
}

module.exports = ControllerContacts;
