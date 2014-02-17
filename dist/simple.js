/*!
 * webkit-dwarf-simple
 * @author donaldyang
 */

define('./simple', function (require, exports, module) {
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
            selector;
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
        }
    });

    $.extend($, {
        expando: 'Simple' + (Math.random() + '').replace(/\D/g, ''),
        guid: 0,
        /**
         * data
         * @param {Element | Object} context
         * @returns Data
         */
        data: (function () {
            var cache = {},
                rmultiDash = /([A-Z])/g;
            function Data(context) {
                if (context.nodeType && context.nodeType === 1) {
                    var name = 'data' + $.expando.replace(rmultiDash, '-$1').toLowerCase(),
                        guid = context.getAttribute(name);
                    if (guid) {
                        this.uid = guid + '';
                    } else {
                        this.uid = ++$.guid + '';
                        context.setAttribute(name, this.uid);
                    }
                    cache[this.uid] = cache[this.uid] || {};
                    this.cache = cache[this.uid];
                } else {
                    var data = context[$.expando];
                    if (data) {
                        this.uid = data.uid;
                        this.cache = data;
                    } else {
                        this.uid = ++$.guid + ''
                        this.cache = context[$.expando] = {
                            uid: this.uid
                        };
                    }
                }
            }
            $.extend(Data.prototype, {
                /**
                 * get
                 * @param {String} key
                 */
                get: function (key) {
                    return this.cache[key];
                },

                /**
                 * set
                 * @param {String} key
                 * @param {Any} value
                 */
                set: function (key, value) {
                    this.cache[key] = value;
                    return this;
                },
                /**
                 * remove
                 * @param {String} key
                 * @returns value
                 */
                remove: function (key) {
                    var obj = this.cache, v;
                    if (key in obj) {
                        v = obj[key];
                        obj[key] = null;
                        delete obj[key];
                    }
                    return v;
                },
                /**
                 * clear
                 */
                clear: function () {
                    if (!this.cache.uid) {
                        cache[this.uid] = null;
                        delete cache[this.uid];
                    }
                    // do something next?
                },
                /**
                 * empty
                 */
                empty: function () {
                    var is = true, i;
                    for (i in this.cache) {
                        is = false;
                        break;
                    }
                    if (is) this.clear();
                }
            });
            return function (context) {
                return new Data(context);
            };
        })()
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
    $.http = {}

    $.extend($.http, {
        getXHR: function () {
            return new XMLHttpRequest();
        },
        data: $.data($.http),
        setXHRToCache: function (xhrObj) {
            $.http.data.set('_xhr_' + (++$.guid), xhrObj);
            return $.guid;
        },
        getXHRFromCache: function (id) {
            return $.http.data.get('_xhr_' + id);
        },
        clearXHRInCache: function (id) {
            $.http.data.remove('_xhr_' + id);
        },
        ajax: function (url, para, cb, method, type) {
            var xhr = $.http.getXHR(), xhrId;
            xhr.open(method, url, true);
            xhrId = $.http.setXHRToCache(xhr);
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
                    $.http.clearXHRInCache(xhrId);
                    xhr = null;
                }            
            }
            xhr.send(para);            
            return xhrId;
        },
        post: function (url, para, cb, type) {
            var s = '', i;
            for (i in para) {
                s += '&' + i + '=' + para[i]; 
            }
            return $.http.ajax(url, s, cb, 'POST', type);
        },
        get: function (url, para, cb, type) {
            var params = [];
            for (var i in para) {
                params.push(i + '=' + para[i]);
            }
            if (url.indexOf('?') === -1) {
                url += '?';   
            }
            url += params.join('&');
            return $.http.ajax(url, null, cb, 'GET', type);
        },
        preload: function (url) {
            var s = doc.createElement('img');
            s.src = url;    
        }
    });

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