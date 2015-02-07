'use strict';

var View = require("./view");

var urlparse = require('url').parse;

class ViewContacts extends View {

  constructor(container, templates, callbacks) {
    super(container, {
      'all': {
        name: 'contacts',
        template: templates.contacts,
        postRender: () => {
          this.initAdd();
          this.initList();
          this.initCurrent();
        },
      },
      'contacts-add': {
        name: 'contacts-add',
        template: templates['contacts-add'],
        postRender: () => {
          this.initAdd();
        },
      },
      'contacts-list': {
        name: 'contacts-list',
        template: templates['contacts-list'],
        postRender: () => {
          this.initList();
        },
      },
      'contacts-current': {
        name: 'contacts-current',
        template: templates['contacts-current'],
        postRender: () => {
          this.initCurrent();
        },
      },
    }, callbacks);
  }

  initAdd() {
    console.log('initAdd');

    var form = document.getElementById("contact-add");
    var self = this;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      self.submitForm(form).then((result) => {
        if (form.elements.type.value === 'add') {
          if (self._callbacks.onContactAdded) {
            self._callbacks.onContactAdded(result);
            form.reset();
          }
        } else if (form.elements.type.value === 'edit') {
          if (self._callbacks.onContactEdited) {
            self._callbacks.onContactEdited(result);
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

}

module.exports = ViewContacts;
