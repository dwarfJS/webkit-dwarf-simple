module.exports = function (grunt) {
  var fs = require('fs');
  grunt.registerTask('make', function(grunt) {
    var done = this.async()
      , files = JSON.parse(fs.readFileSync('config.json'))
      , all = [
        'window.$ = {',
          'define: function (name, factory) {',
              "if (name === 'simple') {",
                  'var define = $.define,',
                      'm = {',
                          'exports: {}',
                      '};',
                  'factory(m.exports, m);',
                  'console.log(m);',
                  'm.exports.define = define;',
                  'window.$ = window.simple = m.exports;',
              '} else {',
                  "var module = name.split('.')[1],",
                      'm = {',
                          'exports: {}',
                      '};',
                  'factory(m.exports, m);',
                  'window.$[module] = m.exports;',
              '}',
          '}',
        '};',
      ].join('');
    files.forEach(function (file) {
      all += '\n' + fs.readFileSync('dist/' + file + '.js')
        .toString()
        .replace(/(\[(.*?)\]\,\s)?function\s\(require\,\s/, 'function (')
        .replace("define('./", "$.define('")
        .replace(/require\(\'\.\/(.*?)\'\)/, '$1');
    });
    fs.writeFile('all/simple.js', all, function () {
      done();
    })
  });
};