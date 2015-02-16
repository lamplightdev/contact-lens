'use strict';


class RouterShared {

  constructor(data, parentRouter) {
    this._data = data;
    this._parentRouter = parentRouter;

    this._ctrlr = this.getController();
  }

  match(route, query, onMatched, onUnmatched, res) {
    route = route || '';

    this._route = route.replace(/\/$/, '').trim().toLowerCase();
    this._routeParts = route.split('/');
    this._query = query;
    var matched = this.getMatched(res);

    if (matched === true) {
      if (onMatched) {
        onMatched(this._ctrlr);
      }
    } else if (matched === false) {
      if (onUnmatched) {
        onUnmatched();
      }
    }
  }
}

module.exports = RouterShared;
