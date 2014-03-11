module.exports = function (grunt) {
  var fs = require('fs')
    , compile = require('./tool/compile')
    , i = 0;
  grunt.registerTask('build', function(grunt) {
    var done = this.async();
    fs.readdirSync('src').forEach(function (file) {
      i++;
      return compile.compile('src/' + file, 'dist/' + file);
    });
    compile.done(i, function () {
      done();
    })
  });
};