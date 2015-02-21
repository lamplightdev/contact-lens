'use strict';

var View = require("./view");

class ViewContacts extends View {

  constructor(container, templates, callbacks) {
    super(container, {
      'all': {
        name: 'contacts',
        template: templates.contacts,
        postRender: () => {
          this.initSearch();
          this.initAdd();
          this.initList();
          this.initCurrent();
        },
      },
      'contacts-search': {
        name: 'contacts-search',
        template: templates['contacts-search'],
        postRender: () => {
          this.initSearch();
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

    var form = this._container.querySelector(".contact-add");
    var self = this;

    if (form) {
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
  }

  initList() {
    console.log('initList');

    this._container.addEventListener('click', (event) => {
      if (event.target.classList.contains('avatar')) {
        event.preventDefault();
        var checkbox = this._container.querySelector('.bulkedit-select-' + event.target.dataset.id);
        checkbox.checked = !checkbox.checked;
      }
    });
  }

  initCurrent() {
    console.log('initCurrent');

    var remove = this._container.querySelector(".contacts-current form.contact-remove");

    if (remove) {
      remove.addEventListener('submit', (event) => {
        event.preventDefault();

        this.submitForm(remove).then(() => {
          if (this._callbacks.onContactRemoved) {
            this._callbacks.onContactRemoved(remove.elements.id.value);
          }
        });
      });
    }
  }

  initSearch() {
    console.log('initSearch');

    var form = this._container.querySelector(".contacts-search form");

    form.addEventListener('keyup', (event) => {
      event.preventDefault();
      this.performSearch(form.elements.q.value);
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.performSearch(form.elements.q.value);
    });
  }

  performSearch(query) {
    query = query.trim();
    if (this._callbacks.onContactSearched) {
      this._callbacks.onContactSearched(query);
    }
  }

}

module.exports = ViewContacts;
