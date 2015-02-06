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

/*
class ControllerContacts extends Controller {

  constructor(template, data, postRender) {
    super(template, data, postRender);

    if (typeof this.view.data.contacts === 'undefined') {
      this.view.data.contacts = [];
    }

    this.setCurrent(this.view.data.currentID);
  }

  getContacts() {
    return this.view.data.contacts;
  }

  addContact(contact) {
    this.view.data.contacts.push(contact);
  }


  remove(id) {
    this.setCurrent(id);
    this.removeCurrent();
  }

  removeCurrent() {
    if (this.view.data.current) {
      this.getContacts().forEach((contact, index) => {
          if (contact.id === this.view.data.current.id) {
              this.view.data.contacts.splice(index, 1);
          }
      });
    }
  }

  setCurrent(id) {
    var current;

    if (id) {
      id = parseInt(id, 10);
      this.getContacts().forEach(function (contact, index) {
          if (contact.id === id) {
              current = contact;
          }
      });
    }

    if (current) {
      this.view.data.current = current;
    }

    return current;
  }
}
*/

module.exports = ControllerContacts;
