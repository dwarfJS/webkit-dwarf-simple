/*!
 * webkit-dwarf-simple-touch
 * @author donaldyang
 */

define(function (require, exports, module) {
    var $ = require('./simple'),
        touch = require('./simple.touch');
    var tap = {
        /**
         * on
         * @param {DOMArray} eles
         * @param {Function} handler
         */
        on: (function () { 
            var TAP_DISTANCE = 20,
                DOUBLE_TAP_TIME = 300;
            var getTouchPos = touch.getTouchPos,
                getDist = touch.getDist;

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
                return touch._bind(eles, handler, 'tap', startEvtHandler, moveEvtHandler, endEvtHandler);
            };
        })(),
        /**
         * off
         * @param {DOMArray} eles
         * @param {Function} handler
         */
        off: function (eles, handler) {
            return touch._unbind(eles, handler, 'tap');
        }
    }
    return module.exports = tap;
});