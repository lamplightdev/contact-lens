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
      this._currentView = new ViewContacts(this._templates, this._container, {
        onContactAdded: (result) => {
          this.add(new ModelContact(result));
          this.edit();
          this.contactsAdd();
          this.contactsList();
        },
        onContactClick: (path) => {
          this._router.navigate(path);
        },
        onContactRemoved: (id) => {
          this.removeByID(parseInt(id, 10));

          this._router.update('/contacts');
          this.edit();
          this.unselect();
          this.contactsAdd();
          this.contactsList();
          this.contactsCurrent();
        },
        onContactEdited: (result) => {
          this.update(new ModelContact(result));
          this.edit();
          this.contactsAdd();
          this.contactsList();
        },
      });
    }
  }

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

  unselect() {
    this._currentContact = null;

    return this;
  }

  select(id) {
    this.unselect();

    if (id) {
      this._currentContact = this._model.getModelByID(id);
    } else {
      this._currentContact = null;
    }

    return this._currentContact;
  }

  edit(id) {
    if (id) {
      this._editContact = this._model.getModelByID(id);
    } else {
      this._editContact = null;
    }

    return this._editContact;
  }

}

module.exports = ControllerContacts;
