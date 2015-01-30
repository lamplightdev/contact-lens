"use strict";

var User = require("../../lib/user.js");
var Handlebars = require("../../node_modules/handlebars/dist/handlebars.runtime.js");

var test = function(name, y = 3) {
  console.log(name, y);
};

new User('joddychris');
test('dave');

var value = '';
var count = 0;

var init = function () {
  var button = document.querySelector(".update");
  var viewTest = document.querySelector(".test");
  var input = document.querySelector(".input");
  var output = document.querySelector(".output");

  value = input.value;

  button.addEventListener('click', function () {
    var template = Handlebars.template(App.templates.test);
    var html = template({data: {
      name: "Tilos" + count,
      value: value
    }});
    viewTest.innerHTML = html;
    init();
  });

  input.addEventListener('keyup', function(event) {
    value = event.target.value;
    output.textContent = value;
  });
  input.addEventListener('change', function(event) {
    value = event.target.value;
    output.textContent = value;
  });

  count++;
};

init();

var fives = [];
var nums = [0, 2, 5, 6, 8, 20, 10];
nums.forEach(v => {
  if (v % 5 === 0) {
    fives.push(v);
  }
});

