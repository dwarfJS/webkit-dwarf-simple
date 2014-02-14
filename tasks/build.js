module.exports = function (grunt) {
  var fs = require('fs')
    , compile = require('./tool/compile');
  grunt.registerTask('build', function() {
    fs.readdirSync('src').forEach(function (file) {
      return compile('src/' + file, 'dist/' + file);
    });
  });
};