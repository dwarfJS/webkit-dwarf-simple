/*!
 * webkit-dwarf-simple-oop
 * @author donaldyang
 */

define('./simple.oop', ['./simple'], function (require, exports, module) {
    'use strict';

    var $ = require('./simple'),
        _hasOwnProperty = Object.prototype.hasOwnProperty;

    function oop(foo) {
        foo.extend = oop.extend;
    }

    $.extend(oop, {
        extend: function (protoProps, staticProps) {
            var parent = this, child;
            if (protoProps && _hasOwnProperty.call(protoProps, 'constructor')) {
                child = protoProps.constructor;
            } else {
                child = function () {
                    return parent.apply(this, arguments);
                }
            }
            $.extend($.extend(child, parent), staticProps);
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            if (protoProps) $.extend(child.prototype, protoProps);
            child.__super__ = parent.prototype;
            return child;
        }
    });

    $.oop = oop;
    return module.exports = oop;
});