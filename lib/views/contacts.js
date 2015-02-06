'use strict';

var utils = require('../utils');
var View = require("./view");

var urlparse = require('url').parse;

class ViewContacts extends View {

  constructor(templates, container, callbacks) {
    super(templates, container, callbacks);
  }

  initAdd() {
    console.log('initAdd');

    var form = document.getElementById("contact-add");

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      this.submitForm(form).then((result) => {
        if (this._callbacks.onContactAdded) {
          this._callbacks.onContactAdded(result);
        }
      });
    });
  }

  initList() {
    console.log('initList');

    var viewContacts = this._container.querySelector(".contacts-list");

    var contacts = viewContacts.querySelectorAll('.contact a[data-action=open]');
    var forms = viewContacts.querySelectorAll('.contact form[data-action=remove]');

    for(let i=0; i<contacts.length; i++) {
      contacts[i].addEventListener('click', (event) => {
        event.preventDefault();

        if (this._callbacks.onContactClick) {
          this._callbacks.onContactClick(urlparse(event.target.href).pathname);
        }
      });
    }

    for(let i=0; i<forms.length; i++) {
      forms[i].addEventListener('submit', (event) => {
        event.preventDefault();

        this.submitForm(forms[i], 'DELETE').then(() => {
          if (this._callbacks.onContactRemoved) {
            this._callbacks.onContactRemoved(forms[i].elements.id.value);
          }
        });
      });
    }
  }

  initCurrent() {
    console.log('initCurrent');
  }

  render(data, preRendered) {
    super.render('contacts', data, preRendered, () => {
      this.initAdd();
      this.initList();
      this.initCurrent();
    });
  }

  renderCurrent(data) {
    super.renderPart('contacts-current', data, () => {
      this.initCurrent();
    });
  }

  renderList(data) {
    super.renderPart('contacts-list', data, () => {
      this.initList();
    });
  }
}

module.exports = ViewContacts;
