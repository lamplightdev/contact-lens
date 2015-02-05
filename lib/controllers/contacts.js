'use strict';

var CollectionController = require('./controller-collection');
var ViewContactsList = require('../views/contacts');


class ControllerContacts extends CollectionController {

  constructor(contacts) {
    super(contacts);
  }

  list(template, into, extraData) {
    new ViewContactsList(template, this._getViewData(), into, extraData).render();
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
