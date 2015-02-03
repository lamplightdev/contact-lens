"use strict";

var ControllerContacts = require("../../lib/controllers/contacts.js");
var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime.js");
var request = require('browser-request');

for(var key in App.templates) {
    if(App.templates.hasOwnProperty(key)) {
        Handlebars.registerPartial(key, Handlebars.template(App.templates[key]));
    }
}

var viewContainer = document.querySelector('.container');
//var viewCurrentContact = document.querySelector(".current-contact");


var ctrlr = new ControllerContacts(App.templates['contacts'], {
  contacts: App.Data.contacts,
  _csrf: App.Data._csrf
}, function () {
  init();
  initCurrentContact();
});


var initCurrentContact = function () {
  var viewContacts = document.querySelector(".list");
  var viewCurrentContact = document.querySelector(".current-contact");

  var links = viewContacts.querySelectorAll('.contact a');

  var linkClick = function (event) {
    event.preventDefault();

    ctrlr.setCurrent(event.target.dataset.id);

    ctrlr.renderPart(App.templates['contacts-current-contact'], viewCurrentContact);
  };

  for(let i=0; i<links.length; i++) {
    links[i].addEventListener('click', linkClick);
  }
};

var init = function () {
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
      ctrlr.addContact({
        id: result.id,
        name: result.name
      });

      ctrlr.renderPart(App.templates['contacts-list'], viewContacts, function() {
        initCurrentContact();
      });
    });
  });
};

init();
initCurrentContact();
