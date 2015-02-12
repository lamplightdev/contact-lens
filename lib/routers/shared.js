'use strict';


class RouterShared {

  constructor(data, parentRouter) {
    this._data = data;
    this._parentRouter = parentRouter;

    this._ctrlr = this.getController();
  }

  match(route, query, onMatched, onUnmatched) {
    route = route || '';

    this._route = route.replace(/\/$/, '').trim().toLowerCase();
    this._routeParts = route.split('/');
    this._query = query;
    var matched = this.getMatched();

    if (matched) {
      if (onMatched) {
        onMatched(this._ctrlr);
      }
    } else {
      if (onUnmatched) {
        onUnmatched();
      }
    }
  }
}

module.exports = RouterShared;
