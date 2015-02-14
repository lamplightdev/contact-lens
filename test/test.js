'use strict';

require("6to5/register");

var assert = require("assert"); // node.js core module



var Model = require('../lib/models/model');

describe('Base Model', function () {


  describe('empty construction', function () {

    it('should have _members and _publicKeys variables', function () {
      var m = new Model();

      assert.deepEqual(m._members, {});
      assert.deepEqual(m._publicKeys, []);
    });
  });


  describe('construction', function () {
    var m;

    before(function() {
      // runs before all tests in this block
    });

    after(function(){
      // runs after all tests in this block
    });

    beforeEach(function(){
      m = new Model(null, null, {
        _id: 1,
        privateMember: 'private',
        name: 'nameTest',
        address: 'addressTest',
      }, [
        'name',
        'address',
      ]);
    });

    afterEach(function(){
      // runs after each test in this block
    });

    it('should have passed options as members', function () {

      assert.deepEqual(m._members, {
        _id: 1,
        privateMember: 'private',
        name: 'nameTest',
        address: 'addressTest',
      });
    });

    it('should have a toJSON method that returns public _members', function () {

      assert.deepEqual(m.toJSON(), {
        name: 'nameTest',
        address: 'addressTest',
      });
    });

  });

});
