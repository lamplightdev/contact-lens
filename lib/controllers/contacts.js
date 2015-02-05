'use strict';

var CollectionController = require('./controller-collection');
var ViewContacts = require('../views/contacts');


class ControllerContacts extends CollectionController {

  constructor(contacts, templates, container, extraData) {
    super(contacts, templates, container, extraData);

    this._view = null;

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
    if (!this._view) {
      this._view = new ViewContacts(this._templates, this._container);
    }
  }

  contacts(preRendered) {
    this._initView();

    this._view.render(this._getViewData(), preRendered);
  }

  contactsCurrent() {
    this._initView();

    this._view.renderCurrent(this._getViewData());
  }

  list(preRendered) {
    this.contacts(preRendered);
  }

  unselect() {
    this._currentContact = null;
  }

  select(id) {
    this._currentContact = this._model.getModelById(id);
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
