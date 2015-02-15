'use strict';

require("6to5/register");

var assert = require("assert"); // node.js core module
var mongoose = require("mongoose");
var mongooseHelpers = require("./helpers/mongoose");


var Storage = require('../lib/models/storage/storage');
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

    beforeEach(function (){
      m = new Model('model', Storage, {
        _id: 1,
        privateMember: 'private',
        name: 'nameTest',
        address: 'addressTest',
      }, [
        'name',
        'address',
      ]);
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

    it('should be able to get ID as string', function () {
      assert.equal(m.getID(), '1');
    });

    it('should be able to set ID', function () {
      m.setID(2);
      assert.equal(m.getID(), '2');
    });


  });

  describe('creation', function () {
    it('should be possible from JSON', function () {
      var data = {
        _id: 1,
        name: 'test',
      };

      var m1 = Model.fromJSON(data, 'model', Storage);
      var m2 = new Model('model', Storage, data);

      //remove storage for these tests as _ids will differ
      [m1, m2].map(function (m) {
        m._storage = null;
        return m;
      });

      assert.deepEqual(m1, m2);
    });

    it('should be possible to create an array of models from JSON', function () {
      var data = [{
        _id: 1,
        name: 'test1',
      }, {
        _id: 2,
        name: 'test2',
      }];

      var m1 = Model.fromJSON(data, 'model', Storage);
      var m2 = [new Model('model', Storage, data[0]), new Model('model', Storage, data[1])];

      //remove storage for these tests as _ids will differ
      [m1[0], m1[1], m2[0], m2[1]].map(function (m) {
        m._storage = null;
        return m;
      });

      assert.deepEqual(m1, m2);
    });
  });

  describe('db methods', function () {
    before(mongooseHelpers.setup);
    after(mongooseHelpers.teardown);

    var m;

    it('should be able save new model to db and get valid ID back', function (done) {

      m = new Model('model', Storage, {
        name: 'testname'
      });

      assert.notEqual(mongoose.Types.ObjectId.isValid(m.getID()), true);

      m.save().then(function () {
        assert.equal(mongoose.Types.ObjectId.isValid(m.getID()), true);

        done();
      }).catch(done);

    });

    it('should delete model by id', function (done) {
      m.delete().then(function () {
        done();
      }).catch(done);
    });
  });

});
