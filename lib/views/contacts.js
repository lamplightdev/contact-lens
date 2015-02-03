'use strict';

var View = require("./view");
var request = require('browser-request');
var urlparse = require('url').parse;

class ViewContacts extends View {

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

    var links = viewContacts.querySelectorAll('.contact a');

    var linkClick = function (event) {
      event.preventDefault();

      self.router.navigate(urlparse(event.target.href).pathname);
    };

    for(let i=0; i<links.length; i++) {
      links[i].addEventListener('click', linkClick);
    }
  }

  initContactAdd() {
    var self = this;

    var form = document.getElementById("contact-add");
    var viewContacts = document.querySelector(".list");

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      var name = event.target.elements.name.value;

      var post_data = {
        _csrf: event.target.elements._csrf.value,
        name: name,
      };

      request.post({
        url: event.target.action,
        form: post_data,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      }, function(err,httpResponse,body) {

        var result = JSON.parse(body);
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
}

module.exports = ViewContacts;
