define(function (require, exports, module) {
    var $ = require('./simple');
    return module.exports = (function () {
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
    })();
});