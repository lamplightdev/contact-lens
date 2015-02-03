'use strict';

class View {

  constructor(router, templates, viewContainer, ctrlr, alreadyRendered, preRendered) {
    this.router = router;
    this.templates = templates;
    this.ctrlr = ctrlr;

    if (!alreadyRendered) {
      if (!preRendered) {
        this.ctrlr.render(viewContainer);
      } else {
        this.ctrlr.view.postRender();
      }
    }
  }
}

module.exports = View;
