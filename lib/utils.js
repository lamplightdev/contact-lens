'use strict';

var fs      = require('fs'),
    path    = require('path'),
    request = require('then-request');

exports.requireDir = requireDir;
exports.xhrSubmitForm = xhrSubmitForm;

// -----------------------------------------------------------------------------

function requireDir(dir) {
    return fs.readdirSync(dir).reduce(function (modules, filename) {
        if (filename === 'index.js' || path.extname(filename) !== '.js') {
            return modules;
        }

        var moduleName = path.basename(filename, '.js'),
            module     = require(path.join(dir, moduleName));

        if (typeof module === 'function' && module.name) {
            moduleName = module.name;
        }

        modules[moduleName] = module;
        return modules;
    }, {});
}

function xhrSubmitForm(form, method, action) {
    var post_data = {};
    for(let i=0; i<form.elements.length; i++) {
        post_data[form.elements[i].name] = form.elements[i].value;
    }

    method = method || form.method;
    action = action || form.action;
    return request(method, action, {
        json: post_data
    });
}
