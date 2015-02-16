'use strict';

/*
* Modified from https://github.com/elliotf/mocha-mongoose
*/

var mongoose = require('mongoose');


var config = {
  db: {
    test: 'mongodb://localhost/contact-lens-test'
  }
};

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

function clearDB(done) {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function() {});
  }

  return done();
}

var setup = function (done) {

 if (mongoose.connection.readyState === 0) {
   mongoose.connect(config.db.test, function (err) {
     if (err) {
       throw err;
     }
     return clearDB(done);
   });
 } else {
   return clearDB(done);
 }
};

var teardown = function (done) {
  return clearDB(done);
};


module.exports.setup = setup;
module.exports.teardown = teardown;
