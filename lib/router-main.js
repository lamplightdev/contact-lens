var Router = require("./router");

var qsParse = require('qs').parse;

var ControllerAccount = require("./controllers/account");
var RouterContacts = require('./routers/contacts');

class RouterMain {

  static getInstance(Data) {
    if (!RouterMain.instance) {
      RouterMain.instance = new RouterMain(Data);
    }

    return RouterMain.instance;
  }

  constructor(Data) {
    this.ctrlr = null;

    var query = location.search;
    if (query) {
      query = qsParse(query.substring(1));
    } else {
      query = {};
    }

    this.router = Router
      .add(/contacts(?:$|\/(.+))/i, (preRendered, match) => {
        new RouterContacts().match(match, {
            contacts: Data.contacts,
            _csrf: Data._csrf,
            templates: Data.templates,
            container: Data.container,
            query: query,
        }, (ctrlr) => {
            ctrlr.renderView(preRendered);
        }, (err) => {
            console.log('contacts route error: ', err);
        });
      })

      .add(/^account$/, (preRendered) => {
        console.log('account');

        if (!(this.ctrlr instanceof ControllerAccount)) {
          this.ctrlr = new ControllerAccount(Data.contacts, Data.templates, Data.container, {
            user: Data.user
          });
        }

        this.ctrlr.renderView(preRendered);
      })

      .add(() => {
        console.log('default');
      })

      .listen();
  }
}

module.exports = RouterMain.getInstance;

