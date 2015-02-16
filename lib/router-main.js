var Router = require("./router");

var qsParse = require('qs').parse;

var ModelUser = require('./models/user');
var RouterSharedContacts = require('./routers/shared-contacts');
var RouterSharedAccount = require('./routers/shared-account');

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
          }, this.router);
        }

        this.sharedRouter.match(match, this.getQueryParams(), (ctrlr) => {
            ctrlr.renderView(preRendered);
        }, (err) => {
            console.log('contacts route error: ', err);
        });
      })

      .add(/account(?:$|\/(.+))/i, (preRendered, match) => {
        console.log('account');

        if (!(this.sharedRouter instanceof RouterSharedAccount)) {
          this.sharedRouter = new RouterSharedAccount({
            user: new ModelUser(Data.user),
            templates: Data.templates,
            container: Data.container
          }, this.router);
        }

        this.sharedRouter.match(match, this.getQueryParams(), (ctrlr) => {
            ctrlr.renderView(preRendered);
        }, (err) => {
            console.log('contacts route error: ', err);
        });
      })

      .add(() => {
        console.log('default');
      })

      .listen();

    this.storeContacts(Data.contacts);
  }

  storeContacts(contacts) {
    localStorage.setItem('contacts', JSON.stringify(contacts));

    console.log(this.retrieveContacts());
  }

  retrieveContacts() {
    var contacts = localStorage.getItem('contacts');
    return contacts ? JSON.parse(contacts) : [];
  }
}

module.exports = RouterMain.getInstance;

