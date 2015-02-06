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

    this._currentView = null;

    this._currentContact = null;
  }

  _getViewData() {
    var data = super._getViewData();

    if (this._currentContact) {
      data.currentContact = this._currentContact.toJSON();
    }

    return data;
  }

  _initView() {
    if (!this._currentView) {
      this._currentView = new ViewContacts(this._templates, this._container, {
        onContactAdded: (result) => {
          this.add(new ModelContact(result));
          this.contactsList();
        },
        onContactClick: (path) => {
          this._router.navigate(path);
        },
        onContactRemoved: (id) => {
          this.removeByID(id);
          this.unselect();
          this.contactsList();
          this.contactsCurrent();
        }
      });
    }
  }

  contacts(preRendered) {
    this._initView();

    this._currentView.render(this._getViewData(), preRendered);
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
    }

    return this._currentContact;
  }

}

module.exports = ControllerContacts;
