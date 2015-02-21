'use strict';

require("6to5/register");

var assert = require("assert"); // node.js core module
var mongoose = require("mongoose");
var mongooseHelpers = require("./helpers/mongoose");


var Model = require('../lib/models/model');

describe('Base Model', function () {


  describe('empty construction', function () {

    it('should have _members and _publicKeys variables', function () {
      var m = new Model();

      assert.deepEqual(m._members, {});
      assert.deepEqual(m._publicKeys, ['_id']);
    });
  });


  describe('construction', function () {
    var m;

    beforeEach(function (){
      m = new Model({
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
        obj: {
          title: 'mr'
        }
      };

      var m1 = Model.fromJSON(data);
      var m2 = new Model(data);

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

      var m1 = Model.fromJSON(data);
      var m2 = [new Model(data[0]), new Model(data[1])];

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

      m = new Model({
        name: 'testname',
        address: 'testaddress',
      });

      assert.notEqual(mongoose.Types.ObjectId.isValid(m.getID()), true);

      m.save().then(function () {
        assert.equal(mongoose.Types.ObjectId.isValid(m.getID()), true);

        done();
      }, done);

    });

    it('should delete model by id', function (done) {
      m.delete().then(function () {
        //TODO: assert?
        done();
      }, done);
    });

    it('should be able to update existing model', function (done) {

      m = new Model({
        name: 'testname',
        address: 'testaddress',
      });

      m.save().then(function () {
        m._members.name = 'testnamechanged';
        return m.sync().then(function () {
          assert.equal(m._members.name, 'testnamechanged');
          assert.equal(m._storage.name, 'testnamechanged');
          return done();
        });
      }).then(null, done);

    });

    it('should be able to save new model when syncing', function (done) {

      m = new Model({
        name: 'testnamenewsync',
        address: 'testaddress',
      });

      m.sync().then(function () {
        assert.equal(mongoose.Types.ObjectId.isValid(m.getID()), true);
        assert.equal(m._members.name, 'testnamenewsync');
        assert.equal(m._storage.name, 'testnamenewsync');
        done();
      }, done);

    });
  });

  describe('db static methods', function () {
    before(mongooseHelpers.setup);
    after(mongooseHelpers.teardown);

    it('should be to insert models into db in batch from JSON', function (done) {

      var data = [{
        name: 'name1',
        address: 'address1'
      }, {
        name: 'name2',
        address: 'address2'
      }];

      Model.insert(data).then(function (models) {
        assert.equal(models.length, 2);
        assert.equal(mongoose.Types.ObjectId.isValid(models[0].getID()), true);
        assert.equal(mongoose.Types.ObjectId.isValid(models[1].getID()), true);

        done();
      }, done);
    });

    it('should be able to load a collection of models from db', function (done) {

      Model.load().then(function (collection) {
        assert.equal(collection._models.length, 2);
        assert.equal(collection._models[0]._members.name, 'name1');
        assert.equal(collection._models[1]._members.name, 'name2');

        done();
      }, done);
    });

    it('should be able to search db by field for matching models', function (done) {

      Model.search('name', 'name2').then(function (collection) {
        assert.equal(collection._models.length, 1);
        assert.equal(collection._models[0]._members.name, 'name2');

        done();
      }, done);
    });

  });

});
