!function () {
  'use strict';
  /**
   * getWrap
   * @param {String} string
   * @keyword {String} keyword
   */
  function getWrap(string, keyword) {
    var start = string.indexOf(keyword)
      , curr = string.indexOf('(', start) + 1
      , open = 1;

    function find(string, start) {
      var l = string.indexOf('(', start)
        , r = string.indexOf(')', start);

      if (l === -1) {
        if (r === -1) {
          throw new Error('Code is not closed');
        } else {
          open--;
          return r;
        }
      } else {
        if (r === -1) {
          open++;
          return l;
        } else if (l < r) {
          open++;
          return l;
        } else {
          open--;
          return r;
        }
      }
    }

    if (!~start) return null;
    while (open) {
      try {
        curr = find(string, curr) + 1;
      } catch (e) {
        return false;
      }
    }
    return string.substring(start, curr);
  }

  /**
   * getBodyDeps
   * @param {String} body
   */
  function getBodyDeps(body) {
    var deps = []
      , got = {};
    body.replace(/(^|[^\.\/\w])require\s*\(\s*(["'])([^"']+?)\2\s*\)/mg, function (full, lead, quote, dep) {
      got[dep] || deps.push(dep);
      got[dep] = true;
      return full;
    });
    return deps;
  }

  /**
   * getRequires
   * @param {String} string
   * @param {String} keyword
   */
  function getDeps(string, keyword) {
    var string = getWrap(string, keyword)
      , body;
    if (!string) return false;
    body = string.match(/function\s*?\([\s\S]*?\)[\s\n\r]{([\s\S]*)}/);
    if (!body) return false;
    body = body[1];
    return getBodyDeps(body);
  }

  module.exports = getDeps;
}();