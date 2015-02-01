"use strict";

var User = require("../../lib/user.js");
var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime.js");
var request = require('request');

var contacts = App.Data.contacts;

var viewCurrentUser = document.querySelector(".current-user");
var viewContacts = document.querySelector(".contacts");

var initCurrentUser = function () {

  var links = viewContacts.querySelectorAll('.contact a');

  var linkClick = function (event) {
    event.preventDefault();

    var id = event.target.dataset.id;
    var current;

    contacts.forEach(function(contact) {
      if (contact.id === parseInt(id, 10)) {
        current = contact;
      }
    });

    var template = Handlebars.template(App.templates['current-user']);
    var html = template({data: {
      current: current
    }});
    viewCurrentUser.innerHTML = html;
  };

  for(let i=0; i<links.length; i++) {
    links[i].addEventListener('click', linkClick);
  }
};

var init = function () {
  var form = document.getElementById("contact-add");

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    var name = event.target.elements.name.value;

    var user = new User({
      name: name
    });

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
      contacts.push({
        id: result.id,
        name: result.name
      });

      var template = Handlebars.template(App.templates.contacts);
      var html = template({data: {
        contacts: contacts
      }});
      viewContacts.innerHTML = html;

      initCurrentUser();
    });
  });
};

init();
initCurrentUser();
