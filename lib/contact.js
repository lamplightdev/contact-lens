'use strict';

class Contact {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
  }

  getID() {
    return this.id;
  }

  getName() {
    return this.name;
  }
}

module.exports = Contact;
