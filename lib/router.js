'use strict';

var Router = {
  routes: [],
  root: '/',

  config: function (options) {
    this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';

    return this;
  },

  getFragment: function() {
      var fragment = '';

      fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;

      return this.clearSlashes(fragment);
  },

  add: function(re, handler) {
      if(typeof re === 'function') {
          handler = re;
          re = '';
      }
      this.routes.push({ re: re, handler: handler});

      return this;
  },

  check: function(preRendered, f) {
      var fragment = f || this.getFragment();
      for(var i=0; i<this.routes.length; i++) {
          var match = fragment.match(this.routes[i].re);
          if(match) {
              match.shift();
              match.unshift(preRendered);
              this.routes[i].handler.apply({}, match);
              return this;
          }
      }
      return this;
  },

  clearSlashes: function(path) {
      return path.toString().replace(/\/$/, '').replace(/^\//, '');
  },

  listen: function() {
    var self = this;
    var current = self.getFragment();

    window.addEventListener("popstate", function() {
      if(current !== self.getFragment()) {
          current = self.getFragment();
          self.check(false, current);
      }
    });

    return this;
  },

  navigate: function(path, check) {
      path = path ? path : '';

      history.pushState(null, null, this.root + this.clearSlashes(path));

      this.check(false);

      return this;
  }
};

module.exports = Router;