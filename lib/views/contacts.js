'use strict';

var View = require("./view");

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
  }

  initCurrent() {
    console.log('initCurrent');

    var remove = this._container.querySelector(".contacts-current form[data-action=remove]");

    if (remove) {
      remove.addEventListener('submit', (event) => {
        event.preventDefault();

        this.submitForm(remove, 'DELETE').then(() => {
          if (this._callbacks.onContactRemoved) {
            this._callbacks.onContactRemoved(remove.elements.id.value);
          }
        });
      });
    }
  }

}

module.exports = ViewContacts;
