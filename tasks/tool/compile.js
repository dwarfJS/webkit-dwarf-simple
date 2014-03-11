!function () {
  'use strict';
  var fs = require('fs')
    , path = require('path')
    , getDeps = require('./getDeps')
    , _l
    , _cb;

  function compile(file, out) {
    fs.readFile(file, function (err, data) {
      if (err) throw err;
      data = data + '';
      var deps = getDeps(data, 'define');
      deps.forEach(function (dep, i) {
        deps[i] = "'" + dep + "'";
      })
      data = data.replace(/define\(/, [
        "define('./",
        out.substring(out.lastIndexOf('/') + 1, out.length - 3),
        "', ",
        deps.length ? "[" + deps.join(',') + "], " : ""
      ].join(''));
      fs.writeFile(out, data, function () {
        check();
      });
    });
  }

  function done(l, cb) {
    _l = l;
    _cb = cb;
  }

  function check() {
    if (!--_l) {
      _cb();
    }
  }

  exports.compile = compile;
  exports.done = done;
}();