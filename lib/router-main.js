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
          }, {
            onContactSearched: (query) => {
              this.router.navigate('/contacts/search?q=' + query);
            },
            onContactAdded: (id) => {
              this.router.navigate('/contacts/' + id);
            },
            onContactRemoved: () => {
              this.router.navigate('/contacts');
            },
            onContactEdited: (id) => {
              this.router.navigate('/contacts/' + id);
            }
          });
        }

        this.sharedRouter.match(match, this.getQueryParams(), (routeParts, query) => {
          this.sharedRouter.getController().renderView(preRendered);

          if (routeParts[0] === 'search') {
            this.router.update('/contacts/search?q=' + query.q);
          }

        }, (err) => {
          Error(err);
          console.log('contacts route error: ', err);
        });
      })

      .add(/account(?:$|\/(.+))/i, (preRendered, match) => {

        if (!(this.sharedRouter instanceof RouterSharedAccount)) {
          this.sharedRouter = new RouterSharedAccount({
            user: new ModelUser(Data.user),
            templates: Data.templates,
            container: Data.container
          });
        }

        this.sharedRouter.match(match, this.getQueryParams(), (routeParts, query) => {
            this.sharedRouter.getController().renderView(preRendered);
        }, (err) => {
          Error(err);
          console.log('account route error: ', err);
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

