/*!
 * webkit-dwarf-simple-dom
 * @author donaldyang
 */

define('./simple.dom', ['./simple'], function (require, exports, module) {
    'use strict';
    var $ = require('./simple');

    var dom = {
        /**
         * append
         * like jQuery.fn.append
         */
        append: function (eles, html) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.insertAdjacentHTML('beforeEnd', html);
            });
        },

        /**
         * prepend
         * like jQuery.fn.prepend
         */
        prepend: function (eles, html) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.insertAdjacentHTML('afterBegin', html);
            });
        },
        /**
         * after
         * like jQuery.fn.after
         */
        after: function (eles, html) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.insertAdjacentHTML('after', html);
            });
        },

        /**
         * before
         * like jQuery.fn.before
         */
        before: function (eles, html) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.insertAdjacentHTML('beforeBegin', html);
            })
        },
        /**
         * remove
         * like jQuery.fn.remove
         */
        remove: function (eles) {
            eles = $(eles);
            eles.forEach(function (ele) {
                ele.parentNode.removeChild(ele);
            });
        }
    }

    return module.exports = dom;
});