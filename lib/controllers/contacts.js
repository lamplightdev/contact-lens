'use strict';

var Controller = require('./controller');

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

  removeContact(contact) {

  }

  setCurrent(id) {
    var current;

    if (id) {
      id = parseInt(id, 10);
      this.getContacts().forEach(function (contact) {
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

module.exports = ControllerContacts;