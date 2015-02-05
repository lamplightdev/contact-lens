'use strict';

var View = require("./view");
//var urlparse = require('url').parse;
//var utils = require('../utils');

class ViewContacts extends View {

  constructor(templates, container) {
    super(templates, container);
  }

  initAdd() {
    console.log('initAdd');
  }

  initList() {
    console.log('initList');
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

  select() {

  }

  /*
  constructor(router, templates, viewContainer, ctrlr, alreadyRendered, preRendered) {
    var self = this;

    ctrlr.view.postRender = function() {
      self.initContactAdd();
      self.initContactsList();
    };

    super(router, templates, viewContainer, ctrlr, alreadyRendered, preRendered);
  }

  initContactsList() {
    var self = this;

    var viewContacts = document.querySelector(".list");
    //var viewCurrentContact = document.querySelector(".current-contact");

    var contacts = viewContacts.querySelectorAll('.contact a[data-action=open]');
    var forms = viewContacts.querySelectorAll('.contact form[data-action=remove');

    var contactClick = function (event) {
      event.preventDefault();

      self.router.navigate(urlparse(event.target.href).pathname);
    };

    var contactSubmit = function (event) {
      event.preventDefault();

      utils.xhrSubmitForm(event.target, 'DELETE', event.target.dataset.apiAction).then(function() {
        self.ctrlr.remove(event.target.elements.id.value);

        self.ctrlr.renderPart(self.templates['contacts-list'], viewContacts, function() {
          self.initContactsList();
        });
      });
    };

    for(let i=0; i<contacts.length; i++) {
      contacts[i].addEventListener('click', contactClick);
    }

    for(let i=0; i<forms.length; i++) {
      forms[i].addEventListener('submit', contactSubmit);
    }
  }

  initContactAdd() {
    var self = this;

    var form = document.getElementById("contact-add");
    var viewContacts = document.querySelector(".list");

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      utils.xhrSubmitForm(event.target).then(function(res) {
        console.log('submitted and recieved');

        var result = JSON.parse(res.getBody());
        self.ctrlr.addContact({
          id: result.id,
          name: result.name
        });

        self.ctrlr.renderPart(self.templates['contacts-list'], viewContacts, function() {
          self.initContactsList();
        });
      });
    });
  }

  selectContact(id) {
    var viewCurrentContact = document.querySelector(".current-contact");
    this.ctrlr.setCurrent(id);
    this.ctrlr.renderPart(this.templates['contacts-current-contact'], viewCurrentContact);
  }
  */
}

module.exports = ViewContacts;
