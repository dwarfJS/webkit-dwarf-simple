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
     * @param {String | DOMArray} selector
     * @param {DOM} context
     */
    var $ = function (selector, context) {
        context = context || doc;
        return typeof selector === 'string' ? 
            $.toArray(context.querySelectorAll(selector)) : 
                Array.isArray(selector) ?
                    selector : 
                        (selector && selector.nodeType === 1) ? [selector] : [];
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
        /**
         * toArray
         * @param {ArrayLikeObject} arr
         */
        toArray: function (arr) {
            var res = [], i, l;
            if (arr) {
                try {
                    res = res.slice.call(arr);
                } catch (e) {
                    res = [];
                    for (i = 0, l = arr.length; i < l; i++) {
                        res[i] = arr[i];
                    }
                }
            }
            return res;
        },

        /**
         * id
         * @param {String} id
         */
        id: function (id) {
            return doc.getElementById(id);
        },
        
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

        function preload(url) {
            var s = doc.createElement('img');
            s.src = url;
        }

        return {
            ajax: ajax,
            get: get,
            post: post,
            preload: preload
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
        add: function (eles, event, handler) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.addEventListener(event, handler, false);
            });
        },
        remove: function (eles, event, handler) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.removeEventListener(event, handler, false);
            });
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
        function addClass(eles, classNames) {
            eles = $(eles);
            eles.forEach(function (ele) {
                classNames.match(rnotwhite).forEach(function (cn) {
                    if (!hasClass(ele, cn)) {
                        ele.className += ' ' + cn;
                    }
                });
            });
        }
        function removeClass(eles, classNames) {
            eles = $(eles);
            eles.forEach(function (ele) {
                classNames.match(rnotwhite).forEach(function (cn) {
                    ele.className = ele.className.replace(classNameRegExp(cn), ' ');
                });
            });
        }
        function hasClass(eles, className) {
            eles = $(eles);
            return eles[0] && eles[0].className.search(classNameRegExp(className)) !== -1;
        }
        return {
            addClass: addClass,
            removeClass: removeClass,
            hasClass: hasClass
        };
    }();

    return module.exports = $;
});