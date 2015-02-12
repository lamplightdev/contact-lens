var Router = require("./router");

var qsParse = require('qs').parse;

var ControllerAccount = require("./controllers/account");
var RouterSharedContacts = require('./routers/shared-contacts');

class RouterMain {

  static getInstance(Data) {
    if (!RouterMain.instance) {
      RouterMain.instance = new RouterMain(Data);
    }

    return RouterMain.instance;
  }

  getQueryParams() {
    var query = location.search;
    if (query) {
      query = qsParse(query.substring(1));
    } else {
      query = {};
    }

    return query;
  }

  constructor(Data) {

    this.sharedRouter = null;

    this.router = Router
      .add(/contacts(?:$|\/(.+))/i, (preRendered, match) => {

        if (!(this.sharedRouter instanceof RouterSharedContacts)) {
          this.sharedRouter = new RouterSharedContacts({
            contacts: Data.contacts,
            _csrf: Data._csrf,
            templates: Data.templates,
            container: Data.container
          }, this.router)
        }

        this.sharedRouter.match(match, this.getQueryParams(), (ctrlr) => {
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

