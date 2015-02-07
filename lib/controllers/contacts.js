'use strict';

var ModelContact = require('../models/contact');
var CollectionController = require('./controller-collection');
var ViewContacts = require('../views/contacts');


class ControllerContacts extends CollectionController {

  constructor(contacts, templates, container, extraData) {
    super(contacts, templates, container, extraData);

    if (typeof window !== 'undefined') { //if running on server window won't exist and so we don't  need the router
      this._router = require('../router-main')().router;
    }

    this._currentContact = null;
    this._editContact = null;

    this._initView();
  }

  _getViewData() {
    var data = super._getViewData();

    if (this._currentContact) {
      data.currentContact = this._currentContact.toJSON();
    }

    if (this._editContact) {
      data.editContact = this._editContact.toJSON();
    }

    return data;
  }

  _initView() {
    if (!this._currentView) {
      this._currentView = new ViewContacts(this._container, this._templates, {
        onContactAdded: (result) => {
          this.add(new ModelContact(result));

          this.list();
          this._router.navigate('/contacts/' + result.id);
        },
        onContactClick: (path) => {
          this._router.navigate(path);
        },
        onContactRemoved: (id) => {
          this.removeByID(parseInt(id, 10));

          this.list();
          this._router.navigate('/contacts');
        },
        onContactEdited: (result) => {
          this.update(new ModelContact(result));

          this.list();
          this._router.navigate('/contacts/' + result.id);
        },
      });
    }
  }

  /*
  contacts(preRendered) {
    this._initView();

    this._currentView.render(this._getViewData(), preRendered);
  }

  contactsAdd() {
    this._initView();

    this._currentView.renderAdd(this._getViewData());
  }

  contactsList() {
    this._initView();

    this._currentView.renderList(this._getViewData());
  }

  contactsCurrent() {
    this._initView();

    this._currentView.renderCurrent(this._getViewData());
  }

  list(preRendered) {
    this.contacts(preRendered);

    return this;
  }
  */


  select(id) {
    if (id && (!this._currentContact || this._currentContact.getID() !== id)) {
      this._currentContact = this._model.getModelByID(id);
      this._currentView.setDirty('contacts-current');
    } else if(!id && this._currentContact) {
      this._currentContact = null;
      this._currentView.setDirty('contacts-current');
    }

    return this._currentContact;
  }

  edit(id) {
    if (id && (!this._editContact || this._editContact.getID() !== id)) {
      this._editContact = this._model.getModelByID(id);
      this._currentView.setDirty('contacts-add');
    } else if(!id && this._editContact) {
      this._editContact = null;
      this._currentView.setDirty('contacts-add');
    }

    return this._editContact;
  }

  list() {
    this._currentView.setDirty('contacts-list');
  }

}

module.exports = ControllerContacts;
