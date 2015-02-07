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
    this.currentCtrlr = null;

    this.router = Router
      .add(/^contacts$/, (preRendered) => {
        console.log('contacts');

        if (!(this.currentCtrlr instanceof ControllerContacts)) {
          this.currentCtrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });

          if (!preRendered) {
            this.currentCtrlr.select();
            this.currentCtrlr.edit();
          }
          //this.currentCtrlr.list(preRendered);
        } else {
          this.currentCtrlr.select();
          this.currentCtrlr.edit();
          //this.currentCtrlr.contactsAdd();
          //this.currentCtrlr.contactsCurrent();
        }

        this.currentCtrlr.renderView(preRendered);
      })

      .add(/^contacts\/(\d+)$/,  (preRendered, id) =>  {
        console.log('contacts id');

        if (!(this.currentCtrlr instanceof ControllerContacts)) {
          this.currentCtrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });

          if (!preRendered) {
            this.currentCtrlr.select(parseInt(id, 10));
            this.currentCtrlr.edit();
          }
          //this.currentCtrlr.list(preRendered);
        } else {
          this.currentCtrlr.select(parseInt(id, 10));
          this.currentCtrlr.edit();
          //this.currentCtrlr.contactsCurrent();
        }

        this.currentCtrlr.renderView(preRendered);
      })

      .add(/^contacts\/edit\/(\d+)$/,  (preRendered, id) =>  {
        console.log('contacts edit');

        if (!(this.currentCtrlr instanceof ControllerContacts)) {
          this.currentCtrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });

          if (!preRendered) {
            this.currentCtrlr.select();
            this.currentCtrlr.edit(parseInt(id, 10));
          }
          //this.currentCtrlr.list(preRendered);
        } else {
          this.currentCtrlr.select();
          this.currentCtrlr.edit(parseInt(id, 10));
          //this.currentCtrlr.contactsAdd();
        }

        this.currentCtrlr.renderView(preRendered);
      })

      .add(/^account$/, (preRendered) => {
        console.log('account');

        if (!(this.currentCtrlr instanceof ControllerAccount)) {
          this.currentCtrlr = new ControllerAccount(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });
        }

        //this.currentCtrlr.account();
        this.currentCtrlr.renderView(preRendered);
      })

      .add(() => {
        console.log('default');
      })

      .listen();
  }
}

module.exports = RouterMain.getInstance;

