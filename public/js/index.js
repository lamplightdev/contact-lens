"use strict";

var Router = require("../../lib/router.js");

var ControllerAccount = require("../../lib/controllers/account.js");
var ControllerContacts = require("../../lib/controllers/contacts.js");

var ViewAccount = require("../../lib/views/account.js");
var ViewContacts = require("../../lib/views/contacts.js");

var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime.js");
var urlparse = require('url').parse;

var viewContainer = document.getElementById('view');
var currentView = null;


for(var key in App.templates) {
  if(App.templates.hasOwnProperty(key)) {
    Handlebars.registerPartial(key, Handlebars.template(App.templates[key]));
  }
}

Router
  .add(/^contacts$/, function (preRendered) {
    console.log('contacts');

    var ctrlr = new ControllerContacts(App.Data.contacts);
    ctrlr.list(App.templates['contacts'], viewContainer, {
      _csrf: App.Data._csrf
    });
    /*
    currentView = new ViewContacts(Router, App.templates, viewContainer, new ControllerContacts(App.templates['contacts'], {
      contacts: App.Data.contacts,
      _csrf: App.Data._csrf
    }), currentView instanceof ViewContacts, preRendered);
  */
  })

  .add(/^contacts\/(.*)$/, function (preRendered, id) {
    console.log('contacts id');
    currentView = new ViewContacts(Router, App.templates, viewContainer, new ControllerContacts(App.templates['contacts'], {
      contacts: App.Data.contacts,
      _csrf: App.Data._csrf
    }), currentView instanceof ViewContacts, preRendered);

    currentView.selectContact(id);
  })

  .add(/account/, function (preRendered) {
    console.log('account');
    currentView = new ViewAccount(Router, App.templates, viewContainer, new ControllerAccount(App.templates['account']), currentView instanceof ViewAccount, preRendered);
  })

  .add(function() {
    console.log('default');
  })

  .listen()
  .check(true);

function nav(event) {
  event.preventDefault();

  Router.navigate(urlparse(event.target.href).pathname);
}

var navLinks = document.querySelectorAll('[data-nav]');
for(let i=0; i<navLinks.length; i++) {
  navLinks[i].addEventListener('click', nav);
}

