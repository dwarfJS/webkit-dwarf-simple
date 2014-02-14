/*!
 * webkit-dwarf-simple-watch
 * @author donaldyang
 */

define('./simple.watch', ['./simple'], function (require, exports, module) {
    'use strict';

    var $ = require('./simple');

    function defineGetAndSet(obj, propName, getter, setter) {
        try {
            Object.defineProperty(obj, propName, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        } catch (e) {
            try {
                Object.prototype.__defineGetter__.call(obj, propName, getter);
                Object.prototype.__defineSetter__.call(obj, propName, setter);
            } catch (e) {
                return false;
            }
        }
        return true;
    }

    function watch(obj, prop, watcher) {
        var val = obj[prop];
        function getter() {
            return val;
        }
        function setter(newval) {
            var oldval = val;
            val = newval;
            watcher(prop);
        }
        defineGetAndSet(obj, prop, getter, setter);
    }

    function unwatch(obj, prop, watcher) {
        var val = obj[prop];
        function getter() {
            return val;
        }
        function setter(newval) {
            var oldval = val;
            val = newval;
        }
        defineGetAndSet(obj, prop, getter, setter);
    }
 
    $.watch = watch;
    return module.exports = watch;
});