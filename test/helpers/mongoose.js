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

var setup = function (done) {

 function clearDB() {
   for (var i in mongoose.connection.collections) {
     mongoose.connection.collections[i].remove(function() {});
   }
   return done();
 }

 if (mongoose.connection.readyState === 0) {
   mongoose.connect(config.db.test, function (err) {
     if (err) {
       throw err;
     }
     return clearDB();
   });
 } else {
   return clearDB();
 }
};

var teardown = function (done) {
 mongoose.disconnect();
 return done();
};


module.exports.setup = setup;
module.exports.teardown = teardown;
