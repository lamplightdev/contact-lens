var Router = require("./router");

var ControllerContacts = require("./controllers/contacts");

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
            this.currentCtrlr.unselect();
          }
          this.currentCtrlr.list(preRendered);
        } else {
          this.currentCtrlr.unselect();
          this.currentCtrlr.contactsCurrent();
        }
      })

      .add(/^contacts\/(.*)$/,  (preRendered, id) =>  {
        console.log('contacts id');

        if (!(this.currentCtrlr instanceof ControllerContacts)) {
          this.currentCtrlr = new ControllerContacts(Data.contacts, Data.templates, Data.container, {
            _csrf: Data._csrf
          });

          if (!preRendered) {
            this.currentCtrlr.select(id);
          }
          this.currentCtrlr.list(preRendered);
        } else {
          this.currentCtrlr.select(id);
          this.currentCtrlr.contactsCurrent();
        }
      })

      .add(() => {
        console.log('default');
      })

      .listen();
  }
}

module.exports = RouterMain.getInstance;

