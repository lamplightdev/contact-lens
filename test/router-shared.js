'use strict';

require("6to5/register");

var assert = require("assert");
var sinon = require("sinon");

var RouterShared = require('../lib/routers/shared');
var Controller = require('../lib/controllers/controller');


describe('Shared Router', function () {

  describe('construction', function () {
    let router;
    let data;
    let callbacks;

    before(function () {
      data = {
        id: 'test',
        name: 'blah',
      };

      callbacks = {
        demo: function() {
          return 'callback';
        }
      };

      router = new RouterShared(data, callbacks);
    });

    it('should have passed _data and _callbacks variables, and init a _ctrlr', function () {
      assert.deepEqual(router._data, data);
      assert.deepEqual(router._callbacks, callbacks);
      assert(router.getController() instanceof Controller);
    });
  });

  describe('matching', function () {
    let router;
    let data;
    let callbacks;

    before(function () {
      data = {
        id: 'test',
        name: 'blah',
      };

      callbacks = {
        demo: function() {
          return 'callback';
        }
      };

      router = new RouterShared(data, callbacks);
    });

    it('should match a defined route', function () {
      var onMatched = sinon.spy();
      var onUnmatched = sinon.spy();

      router.match('test', null, onMatched, onUnmatched);

      assert(onMatched.called);
      assert(!onUnmatched.called);
    });

    it('should not match an undefined route', function () {
      var onMatched = sinon.spy();
      var onUnmatched = sinon.spy();

      router.match('other', null, onMatched, onUnmatched);

      assert(!onMatched.called);
      assert(onUnmatched.called);
    });
  });

});
