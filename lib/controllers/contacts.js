'use strict';

var ModelContact = require('../models/contact');
var Collection = require('../models/collection');
var CollectionController = require('./controller-collection');
var ViewContacts = require('../views/contacts');


class ControllerContacts extends CollectionController {

  constructor(contacts, templates, container, extraData) {
    super(contacts, templates, container, extraData);

    if (typeof window !== 'undefined') { //if running on server window won't exist and so we don't  need the router
      this._router = require('../router-main')().router;
    }

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
        onContactSearched: (query, results) => {
          var matches = [];
          results.forEach((model) => {
            matches.push(new ModelContact(model));
          });
          this.updateSearch(query, new Collection(matches));
          this._router.navigate('/contacts/search?q=' + query);
        },
        onContactAdded: (result) => {
          var modelToAdd = new ModelContact(result);
          modelToAdd.sync();
          this.add(modelToAdd);
          this._view.setDirty('contacts-list');
          this._router.navigate('/contacts/' + modelToAdd.getID());
        },
        onContactRemoved: (id) => {
          this.removeByID(id);
          this._view.setDirty('contacts-list');
          this._router.navigate('/contacts');
        },
        onContactEdited: (result) => {
          var modelToEdit = new ModelContact(result);
          modelToEdit.sync();
          this.update(modelToEdit);
          this._view.setDirty('contacts-list');
          this._router.navigate('/contacts/' + modelToEdit.getID());
        },
      });
    }
  }


  select(id) {
    if (id && (!this._currentContact || this._currentContact.getID() !== id)) {
      this._currentContact = this._model.getModelByID(id);
      this._view.setDirty('contacts-current');
    } else if(!id && this._currentContact) {
      this._currentContact = null;
      this._view.setDirty('contacts-current');
    }

    return this._currentContact;
  }

  edit(id) {
    if (id && (!this._editContact || this._editContact.getID() !== id)) {
      this._editContact = this._model.getModelByID(id);
      this._view.setDirty('contacts-add');
      this.resetSearch();
    } else if(!id && this._editContact) {
      this._editContact = null;
      this._view.setDirty('contacts-add');
    }

    return this._editContact;
  }

  resetSearch() {
    if (!this._search || this._search.active) {
      this._search = {
        active: false,
        query: null,
        results: null,
      };
      this._view.setDirty('contacts-search');
    }
  }

  updateSearch(term, matches) {
    this._search = {
      active: true,
      query: term,
      results: matches,
    };
    this._view.setDirty('contacts-search');
  }

  search(term) {
    return new ModelContact().search('name', term).then((matches) => {
      this.updateSearch(term, matches);

      return matches;
    });
  }
}

module.exports = ControllerContacts;
