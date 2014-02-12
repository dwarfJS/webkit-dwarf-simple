/*!
 * webkit-dwarf-simple
 * @author donaldyang
 */

define('./simple', function (require, exports, module) {
    'use strict';

    var doc = document,
        win = window;

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
            if (!arr) {
                try {
                    res.slice.call(arr);
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
         * isArray
         * @param {Any} arr
         */
        isArray: function (arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
        },

        /**
         * id
         * @param {String} id
         */
        id: function (id) {
            var ele = doc.getElementById(id);
            return ele ? [ele] : [];
        }
    });

    $.extend($, {
        expando: 'Simple' + Math.random().replace(/\D/g, ''),
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
                    var name = 'data-' + $.expando.replace(rmultiDash, '-$1').toLowerCase(),
                        guid = context.getAttribute(name);
                    if (guid) {
                        this.uid = guid + '';
                    } else {
                        this.uid = ++$.guid + '';
                        context.setAttribute(name, this.uid);
                    }
                } else {
                    this.uid = context[$.expando] || ++$.guid + '';
                    context[$.expando] = this.uid;
                }
            }
            $.extend(Data.prototype, {
                /**
                 * get
                 * @param {String} key
                 */
                get: function (key) {
                    return cache[this.uid][key];
                },

                /**
                 * set
                 * @param {String} key
                 * @param {Any} value
                 */
                set: function (key, value) {
                    cache[this.uid][key] = value;
                    return this;
                },
                /**
                 * remove
                 * @param {String} key
                 * @returns value
                 */
                remove: function (key) {
                    var obj = cache[this.uid], v;
                    if (key in obj) {
                        v = obj[key];
                        obj[key] = null;
                        delete obj[key];
                    }
                    return v;
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
    $.http = {
        getXHR: function () {
            return new XMLHttpRequest();
        },
        data: $.data($.http),
        setXHRToCache: function (xhrObj) {
            $.http.data.set('xhr_' + (++$.guid), xhrObj);
            return $.guid;
        },
        getXHRFromCache: function (id) {
            return $.http.data.get('xhr_' + id);
        },
        clearXHRInCache: function (id) {
            $.http.data.remove('xhr_' + id);
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
    }

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
        },
        /**
         * tap
         * @param {DOMArray} eles
         * @param {Function} handler
         */
        tap: (function () { 
            var TAP_DISTANCE = 20,
                DOUBLE_TAP_TIME = 300;
            function getTouchPos(e) {
                var t = e.touches[0];
                return { x: t.clientX, y: t.clientY };
            }
            function getDist(p1, p2) {
                if (!p1 || !p2) return 0;
                return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
            }
            return function (eles, handler) {
                var pt_pos,
                    ct_pos,
                    pt_up_pos,
                    pt_up_time,
                    evtType;
                function startEvtHandler(e) {
                    var touches = touches;
                    if (!touches || touches.length === 1) {
                        ct_pos = pt_pos = getTouchPos(e);
                    }
                }
                function moveEvtHandler(e) {
                    e.preventDefault();
                    ct_pos = getTouchPos(e);
                }
                function endEvtHandler(e) {
                    var now = Date.now(),
                        dist = getDist(ct_pos, pt_pos),
                        up_dist = getDist(ct_pos, pt_up_pos);
                    if (dist < TAP_DISTANCE) {
                        if (pt_up_time && now - pt_up_time < DOUBLE_TAP_TIME && up_dist < TAP_DISTANCE) {
                            evtType = 'doubletap';
                        } else {
                            evtType = 'tap';
                        }
                        handler.call(this, {
                            target: e.target,
                            type: evtType
                        });
                        pt_up_pos = ct_pos;
                        pt_up_time = now;
                    }
                }
                eles = $(eles);
                $.e.add(eles, 'touchstart', startEvtHandler);
                $.e.add(eles, 'touchmove', moveEvtHandler);
                $.e.add(eles, 'touchend', endEvtHandler);
                var hid = $.data(hData).uid;
                eles.forEach(function (ele) {
                    var data = $.data(ele);
                    data.set('tap' + data.uid + hid + 's', startEvtHandler)
                        .set('tap' + data.uid + hid + 'm', moveEvtHandler)
                        .set('tap' + data.uid + hid + 'e', endEvtHandler);
                });
            };
        })(),
        /**
         * untap
         * @param {DOMArray} eles
         * @param {Function} handler
         */
        untap: function (eles, handler) {
            eles = $(eles);
            var hid = $.data(hData).uid;
            eles.forEach(function (ele) {
                var data = $.data(ele), aEle = [ele], tmp;
                (tmp = data.remove('tap' + data.uid + hid + 's')) &&
                    $.e.remove(aEle, 'touchstart', tmp);
                (tmp = data.remove('tap' + data.uid + hid + 'm')) &&
                    $.e.remove(aEle, 'touchmove', tmp);
                (tmp = data.remove('tap' + data.uid + hid + 'e')) &&
                    $.e.remove(aEle, 'touchend', tmp);
            });
        }
    };

    /**
     * css
     * @static
     * @class
     */
    $.css = {
        addClass: function (eles, className) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.classList.add(className);
            });
        },
        removeClass: function (eles, className) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.classList.remove(className);
            });
        },
        hasClass: function (eles, className) {
            eles = $(eles);
            return eles[0] && eles[0].classList.contains(className);
        }
    };

    return module.exports = $;
});