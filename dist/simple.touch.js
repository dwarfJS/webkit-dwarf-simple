/*!
 * webkit-dwarf-simple-touch
 * @author donaldyang
 */

define('./simple.touch', ['./simple'], function (require, exports, module) {
    var $ = require('./simple');
    /**
     * touch
     * @class
     * @static
     */
    var touch = {
        /**
         * getDist
         * @param {Position} p1
         * @param {Position} p2
         */
        getDist: function (p1, p2) {
            if (!p1 || !p2) return 0;
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        },
        /**
         * getTouchPos
         * @param {TouchEvent} e
         * @returns {Position}
         */
        getTouchPos: function (e) {
            var t = e.touches[0];
            return { x: t.clientX, y: t.clientY };
        },
        /**
         * bind
         * @private
         */
        _bind: function (eles, handler, type, startEvtHandler, moveEvtHandler, endEvtHandler) {
            eles = $(eles);
            $.e.add(eles, 'touchstart', startEvtHandler);
            $.e.add(eles, 'touchmove', moveEvtHandler);
            $.e.add(eles, 'touchend', endEvtHandler);
            var hid = $.data(handler).uid;
            eles.forEach(function (ele) {
                var data = $.data(ele);
                data.set('_' + type + data.uid + 'n' + hid + 's', startEvtHandler)
                    .set('_' + type + data.uid + 'n' + hid + 'm', moveEvtHandler)
                    .set('_' + type + data.uid + 'n' + hid + 'e', endEvtHandler);
            });
        },
        /**
         * unbind
         * @private
         */
        _unbind: function (eles, handler, type) {
            eles = $(eles);
            var hid = $.data(handler).uid;
            eles.forEach(function (ele) {
                var data = $.data(ele), aEle = [ele], tmp;
                (tmp = data.remove('_' + type + data.uid + 'n' + hid + 's')) &&
                    $.e.remove(aEle, 'touchstart', tmp);
                (tmp = data.remove('_' + type + data.uid + 'n' + hid + 'm')) &&
                    $.e.remove(aEle, 'touchmove', tmp);
                (tmp = data.remove('_' + type + data.uid + 'n' + hid + 'e')) &&
                    $.e.remove(aEle, 'touchend', tmp);
                data.empty();
            });
        }
    }

    return module.exports = touch;
});