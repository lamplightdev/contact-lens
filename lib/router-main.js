var Router = require("./router");

var ControllerContacts = require("./controllers/contacts");
var ControllerAccount = require("./controllers/account");

class RouterMain {

  static getInstance(Data) {
    if (!RouterMain.instance) {
      RouterMain.instance = new RouterMain(Data);
    }

    return RouterMain.instance;
  }

  constructor(Data) {
    this.ctrlr = null;

    this.router = Router
      .add(/^contacts$/, (preRendered) => {
        console.log('contacts');

        if (!(this.ctrlr instanceof ControllerContacts)) {
          this.ctrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });

        }
        this.ctrlr.select();
        this.ctrlr.edit();

        this.ctrlr.renderView(preRendered);
      })

      .add(/^contacts\/([0-9a-f]+)$/,  (preRendered, id) =>  {
        console.log('contacts id');

        if (!(this.ctrlr instanceof ControllerContacts)) {
          this.ctrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });
        }

        this.ctrlr.select(id);
        this.ctrlr.edit();

        this.ctrlr.renderView(preRendered);
      })

      .add(/^contacts\/edit\/([0-9a-f]+)$/,  (preRendered, id) =>  {
        console.log('contacts edit');

        if (!(this.ctrlr instanceof ControllerContacts)) {
          this.ctrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });
        }

        this.ctrlr.select();
        this.ctrlr.edit(id);

        this.ctrlr.renderView(preRendered);
      })

      .add(/^contacts\/search$/,  (preRendered) =>  {
        console.log('contacts search');

        if (!(this.ctrlr instanceof ControllerContacts)) {
          this.ctrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });
        }

        this.ctrlr.search();

        this.ctrlr.renderView(preRendered);
      })

      .add(/^account$/, (preRendered) => {
        console.log('account');

        if (!(this.ctrlr instanceof ControllerAccount)) {
          this.ctrlr = new ControllerAccount(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
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

