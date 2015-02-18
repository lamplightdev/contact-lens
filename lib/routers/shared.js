'use strict';


class RouterShared {

  constructor(data, callbacks) {
    this._data = data;
    this._callbacks = callbacks;

    this._ctrlr = this.initController();
  }

  getController() {
    return this._ctrlr;
  }

  match(route, query, onMatched, onUnmatched) {
    route = route || '';

    route = route.replace(/\/$/, '').trim().toLowerCase();
    let routeParts = route.split('/');

    var matched = this.getMatched(route, routeParts, query);

    if (matched === true) {
      if (onMatched) {
        onMatched(routeParts, query);
      }
    } else {
      if (onUnmatched) {
        onUnmatched(routeParts, query);
      }
    }
  }
}

module.exports = RouterShared;
