/*!
 * webkit-dwarf-simple
 * @author donaldyang
 */

define(function (require, exports, module) {
    'use strict';

    var doc = document,
        win = window,
        rnotwhite = /\S+/g;

    /**
     * $
     * @param {String | Element} selector
     */
    var $ = function (selector) {
        return typeof selector === 'string' ?
            doc.getElementById(selector) :
                (selector && selector.nodeType === 1) ?
                    selector : null;
    };
    /**
     * extend
     * @param {Object} dest
     * @param {Object} src
     */
    $.extend = function (dest, src) {
        var n;
        for (n in src) {
            if (src.hasOwnProperty(n)) dest[n] = src[n];
        }
        return dest;
    }
    $.extend($, {
        expando: 'Simple' + (Math.random() + '').replace(/\D/g, ''),
        guid: 0
    });

    /**
     * coookie
     * @class
     * @static
     */
    $.cookie = {
        /**
         * get
         * @param {String} n
         */
        get: function (n) {
            var m = doc.cookie.match(new RegExp('(^| )' + n + '=([^;]*)(;|$)')); 
            return !m ? '' : decodeURIComponent(m[2]);  
        },
        /**
         * set
         */
        set: function (name, value, domain, path, hour) {
            var expire = new Date(); 
            expire.setTime(expire.getTime() + (hour ? 3600000 * hour : 30 * 24 * 60 * 60 * 1000));
            doc.cookie = name + '=' + value + '; ' + 'expires=' + expire.toGMTString() + '; path=' + (path ? path : '/') + '; ' + (domain ? ('domain=' + domain + ';') : ''); 
        },

        /**
         * del
         */
        del: function () {
            document.cookie = name + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=' + (path ? path : '/') + ';' + (domain ? ('domain=' + domain + ';') : ''); 
        }
    };

    /**
     * http
     * @class
     * @static
     */
    $.http = function () {
        function ajax(url, para, cb, method, type) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || xhr.status === 1223 || xhr.status === 0) {
                        if (typeof type === 'undefined' && xhr.responseText) {
                            cb(JSON.parse(xhr.responseText));
                        } else {
                            cb(xhr.responseText);
                        }       
                    } else {
                        cb({ec: xhr.status});
                    }
                    xhr = null;
                }            
            }
            xhr.send(para);
            return xhr;
        }

        function _encode(para) {
            var i, arr = [];
            for (i in para) {
                arr.push(i + '=' + para[i]);
            }
            return arr.join('&');
        }

        function post(url, para, cb, type) {
            return ajax(url, _encode(para), cb, 'POST', type);
        }

        function get(url, para, cb, type) {
            url.indexOf('?') === -1 && (url += '?');
            return ajax(url + _encode(para), null, cb, 'GET', type);
        }

        return {
            ajax: ajax,
            get: get,
            post: post
        }
    }();

    $.get = $.http.get;
    $.post = $.http.post;

    /**
     * bom
     * @class
     * @static
     */
    $.bom = {
        query: function (n) { 
            var m = win.location.search.match(new RegExp('(\\?|&)' + n + '=([^&]*)(&|$)'));   
            return !m ? '' : decodeURIComponent(m[2]);  
        },
        getHash: function (n) {
            var m = win.location.hash.match(new RegExp('(#|&)' + n + '=([^&]*)(&|$)'));
            return !m ? '' : decodeURIComponent(m[2]);
        }
    };

    /**
     * e
     * @class
     * @static
     */
    $.e = {
        add: function (ele, event, handler) {
            ele = $(ele);
            ele && ele.addEventListener(event, handler, false);
        },
        remove: function (eles, event, handler) {
            ele = $(ele);
            ele && ele.removeEventListener(event, handler, false);
        }
    };

    /**
     * css
     * @static
     * @class
     */
    $.css = function () {
        function classNameRegExp(className) {
            return new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g');
        }
        function addClass(ele, classNames) {
            ele = $(ele);
            ele && classNames.match(rnotwhite).forEach(function (cn) {
                if (!hasClass(ele, cn)) {
                    ele.className += ' ' + cn;
                }
            });
        }
        function removeClass(ele, classNames) {
            ele = $(ele);
            ele && classNames.match(rnotwhite).forEach(function (cn) {
                ele.className = ele.className.replace(classNameRegExp(cn), ' ');
            });
        }
        function hasClass(ele, className) {
            ele = $(ele);
            return ele && ele.className.search(classNameRegExp(className)) !== -1;
        }
        return {
            addClass: addClass,
            removeClass: removeClass,
            hasClass: hasClass
        };
    }();

    return module.exports = $;
});