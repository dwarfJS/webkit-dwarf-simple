!function () {
  'use strict';
  var fs = require('fs')
    , path = require('path')
    , getDeps = require('./getDeps');

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
      fs.writeFile(out, data);
    });
  }

  module.exports = compile;
}();