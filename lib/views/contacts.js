'use strict';

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
        if (form.elements.type.value === 'add') {
          if (this._callbacks.onContactAdded) {
            this._callbacks.onContactAdded(result);
          }
        } else if (form.elements.type.value === 'edit') {
          if (this._callbacks.onContactEdited) {
            this._callbacks.onContactEdited(result);
          }
        }
      });
    });
  }

  initList() {
    console.log('initList');

    var viewContacts = this._container.querySelector(".contacts-list");

    var opens = viewContacts.querySelectorAll('.contact a[data-action=open]');
    var edits = viewContacts.querySelectorAll('.contact a[data-action=edit]');
    var removes = viewContacts.querySelectorAll('.contact form[data-action=remove]');

    for(let i=0; i<opens.length; i++) {
      opens[i].addEventListener('click', (event) => {
        event.preventDefault();

        if (this._callbacks.onContactClick) {
          this._callbacks.onContactClick(urlparse(event.target.href).pathname);
        }
      });
    }

    for(let i=0; i<edits.length; i++) {
      edits[i].addEventListener('click', (event) => {
        event.preventDefault();

        if (this._callbacks.onContactEdited) {
          this._callbacks.onContactClick(urlparse(event.target.href).pathname);
        }
      });
    }

    for(let i=0; i<removes.length; i++) {
      removes[i].addEventListener('submit', (event) => {
        event.preventDefault();

        this.submitForm(removes[i], 'DELETE').then(() => {
          if (this._callbacks.onContactRemoved) {
            this._callbacks.onContactRemoved(removes[i].elements.id.value);
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

  renderAdd(data) {
    super.renderPart('contacts-add', data, () => {
      this.initAdd();
    });
  }

  renderList(data) {
    super.renderPart('contacts-list', data, () => {
      this.initList();
    });
  }

  renderCurrent(data) {
    super.renderPart('contacts-current', data, () => {
      this.initCurrent();
    });
  }

}

module.exports = ViewContacts;
