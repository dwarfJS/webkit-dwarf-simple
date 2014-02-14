/*!
 * webkit-dwarf-simple-swipe
 * @author donaldyang
 */

define('./simple.swipe', ['./simple','./simple.touch'], function (require, exports, module) {
    'use strict';
    var $ = require('./simple'),
        touch = require('./simple.touch'),
        on, off;
    on = (function () {
        var SWIPE_DISTANCE = 30,
            SWIPE_TIME = 500;
        var getTouchPos = touch.getTouchPos,
            getDist = touch.getDist;
        function getSwipeDirection(p2, p1) {
            var dx = p2.x - p1.x,
                dy = -p2.y + p1.y,
                angle = Math.atan2(dy, dx) * 180 / Math.PI;
            if (angle < 45 && angle > -45) return 'right';
            if (angle >= 45 && angle < 135) return 'top';
            if (angle >= 135 || angle < -135) return 'left';
            if (angle >= -135 && angle > -45) return 'bottom';
        }

        return function (eles, handler) {
            var pt_pos, ct_pos, pt_time, pt_up_time, pt_up_pos;
            function startEvtHandler(e) {
                var touches = e.touches;
                if (touches.length === 1) {
                    pt_pos = ct_pos = getTouchPos(e);
                    pt_time = Date.now();
                }
            }
            function moveEvtHandler(e) {
                e.preventDefault();
                ct_pos = getTouchPos(e);
            }
            function endEvtHandler(e) {
                var dir;
                pt_up_pos = ct_pos;
                pt_up_time = Date.now();
                if (getDist(pt_pos, pt_up_pos) > SWIPE_DISTANCE && pt_up_time - pt_time < SWIPE_TIME) {
                    dir = getSwipeDirection(pt_up_pos, pt_pos);
                    handler.call(this, {
                        target: e.target,
                        type: 'swipe',
                        direction: dir
                    });
                }
            }
            return touch._bind(eles, handler, 'swipe', startEvtHandler, moveEvtHandler, endEvtHandler);
        };
    })();

    off = function (eles, handler) {
        return touch._unbind(eles, handler, 'swipe');
    }
    
    exports.on = on;
    exports.off = off;
});