"use strict";

require("6to5/polyfill");

var RouterMain = require("../../lib/router-main");

var ModelContact = require("../../lib/models/contact");
var Collection  = require("../../lib/models/collection");

var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime");
var urlparse = require('url').parse;


for(var key in App.templates) {
  if(App.templates.hasOwnProperty(key)) {
    Handlebars.registerPartial(key, Handlebars.template(App.templates[key]));
  }
}


var router = new RouterMain({
  templates: App.templates,
  container: document.getElementById('view'),
  contacts: new Collection(ModelContact.fromJSON(App.Data.contacts)),
  _csrf: App.Data._csrf
});

if (!App.Data.status404) {
  router.router.check(true);
}


var navLinks = document.querySelectorAll('[data-nav]');
for(let i=0; i<navLinks.length; i++) {
  navLinks[i].addEventListener('click', (event) => {
    event.preventDefault();

    router.router.navigate(urlparse(event.target.href).pathname);
  });
}

