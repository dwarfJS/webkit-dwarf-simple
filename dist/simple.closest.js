/*!
 * webkit-dwarf-simple-closest
 * @author donaldyang
 */

define('./simple.closest', ['./simple'], function (require, exports, module) {
    'use strict';

    var $ = require('./simple');

    var de = document.documentElement,
        /**
         * http://caniuse.com/#feat=matchesselector
         * "matches" DOM Selector API will be used in the future
         */ 
        match = de.webkitMatchesSelector || de.matchesSelector;

    function _matchElement(selector, refElement) {
        refElement = refElement || de;
        return match.call(refElement, selector);
    }

    /**
     * closest
     * @param {String} selector
     * @param {DOM} context
     */
    function closest(selector, context) {
        var res = null;
        context = $(context);
        context.every(function (cur) {
            while (cur.nodeType === 1) {
                if (_matchElement(selector, cur)) {
                    res = cur;
                    return false;
                } else {
                    cur = cur.parentNode;
                }
            }
            return true;
        });
        return res;
    }

    return module.exports = closest;
});