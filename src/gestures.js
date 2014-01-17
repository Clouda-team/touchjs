/** 手势识别 */
var pos = {
    start: null,
    move: null,
    end: null
};

var startTime = 0;
var fingers = 0;
var startEvent = null;
var moveEvent = null;
var endEvent = null;
var startSwiping = false;
var startPinch = false;
var startDrag = false;

var __offset = {};
var __touchStart = false;
var __holdTimer = null;
var __tapped = false;
var __lastTapEndTime = null;
var __tapTimer = null;

var __scale_last_rate = 1;
var __rotation_single_finger = false;
var __rotation_single_start = [];
var __initial_angle = 0;
var __rotation = 0;

var __prev_tapped_end_time = 0;
var __prev_tapped_pos = null;

var gestures = {
    getAngleDiff: function(currentPos) {
        var diff = parseInt(__initial_angle - utils.getAngle180(currentPos[0], currentPos[1]), 10);
        var count = 0;

        while (Math.abs(diff - __rotation) > 90 && count++ < 50) {
            if (__rotation < 0) {
                diff -= 180;
            } else {
                diff += 180;
            }
        }
        __rotation = parseInt(diff, 10);
        return __rotation;
    },
    pinch: function(ev) {
        var el = ev.target;
        if (config.pinch) {
            if (!__touchStart) return;
            if (utils.getFingers(ev) < 2) {
                if (!utils.isTouchEnd(ev)) return;
            }
            var scale = utils.calScale(pos.start, pos.move);
            var rotation = this.getAngleDiff(pos.move);
            var eventObj = {
                type: '',
                originEvent: ev,
                scale: scale,
                rotation: rotation,
                direction: (rotation > 0 ? 'right' : 'left'),
                fingersCount: utils.getFingers(ev)
            };
            if (!startPinch) {
                startPinch = true;
                eventObj.fingerStatus = "start";
                engine.trigger(el, smrEventList.PINCH_START, eventObj);
            } else if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = "move";
                engine.trigger(el, smrEventList.PINCH, eventObj);
            } else if (utils.isTouchEnd(ev)) {
                eventObj.fingerStatus = "end";
                engine.trigger(el, smrEventList.PINCH_END, eventObj);
                utils.reset();
            }

            if (Math.abs(1 - scale) > config.minScaleRate) {
                var scaleEv = utils.simpleClone(eventObj);

                //手势放大, 触发pinchout事件
                var scale_diff = 0.00000000001; //防止touchend的scale与__scale_last_rate相等，不触发事件的情况。
                if (scale > __scale_last_rate) {
                    __scale_last_rate = scale - scale_diff;
                    engine.trigger(el, smrEventList.PINCH_OUT, scaleEv, false);
                } //手势缩小,触发pinchin事件
                else if (scale < __scale_last_rate) {
                    __scale_last_rate = scale + scale_diff;
                    engine.trigger(el, smrEventList.PINCH_IN, scaleEv, false);
                }

                if (utils.isTouchEnd(ev)) {
                    __scale_last_rate = 1;
                }
            }

            if (Math.abs(rotation) > config.minRotationAngle) {
                var rotationEv = utils.simpleClone(eventObj),
                    eventType;

                eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT : smrEventList.ROTATION_LEFT;
                engine.trigger(el, eventType, rotationEv, false);
                engine.trigger(el, smrEventList.ROTATION, eventObj);
            }

        }
    },
    rotateSingleFinger: function(ev) {
        var el = ev.target;
        if (__rotation_single_finger && utils.getFingers(ev) < 2) {
            if (!pos.move) return;
            if (__rotation_single_start.length < 2) {
                var docOff = utils.getXYByElement(el);

                __rotation_single_start = [{
                        x: docOff.left + el.offsetWidth / 2,
                        y: docOff.top + el.offsetHeight / 2
                    },
                    pos.move[0]
                ];
                __initial_angle = parseInt(utils.getAngle180(__rotation_single_start[0], __rotation_single_start[1]), 10);
            }
            var move = [__rotation_single_start[0], pos.move[0]];
            var rotation = this.getAngleDiff(move);
            var eventObj = {
                type: '',
                originEvent: ev,
                rotation: rotation,
                direction: (rotation > 0 ? 'right' : 'left'),
                fingersCount: utils.getFingers(ev)
            };
            if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = "move";
            } else if (utils.isTouchEnd(ev) || ev.type === 'mouseout') {
                eventObj.fingerStatus = "end";
                engine.trigger(el, smrEventList.PINCH_END, eventObj);
                utils.reset();
            }
            var eventType = rotation > 0 ? smrEventList.ROTATION_RIGHT : smrEventList.ROTATION_LEFT;
            engine.trigger(el, eventType, eventObj);
            engine.trigger(el, smrEventList.ROTATION, eventObj);
        }
    },
    swipe: function(ev) {
        var el = ev.target;
        if (!__touchStart || !pos.move || utils.getFingers(ev) > 1) {
            return;
        }

        var now = Date.now();
        var touchTime = now - startTime;
        var distance = utils.getDistance(pos.start[0], pos.move[0]);
        var position = {
            x: pos.move[0].x - __offset.left,
            y: pos.move[0].y - __offset.top
        };
        var angle = utils.getAngle(pos.start[0], pos.move[0]);
        var direction = utils.getDirectionFromAngle(angle);
        var touchSecond = touchTime / 1000;
        var factor = ((10 - config.swipeFactor) * 10 * touchSecond * touchSecond);
        var eventObj = {
            type: smrEventList.SWIPE,
            originEvent: ev,
            position: position,
            direction: direction,
            distance: distance,
            distanceX: pos.move[0].x - pos.start[0].x,
            distanceY: pos.move[0].y - pos.start[0].y,
            x: pos.move[0].x - pos.start[0].x,
            y: pos.move[0].y - pos.start[0].y,
            angle: angle,
            duration: touchTime,
            fingersCount: utils.getFingers(ev),
            factor: factor
        };
        if (config.swipe) {
            var swipeTo = function() {
                var elt = smrEventList;
                switch (direction) {
                    case 'up':
                        engine.trigger(el, elt.SWIPE_UP, eventObj);
                        break;
                    case 'down':
                        engine.trigger(el, elt.SWIPE_DOWN, eventObj);
                        break;
                    case 'left':
                        engine.trigger(el, elt.SWIPE_LEFT, eventObj);
                        break;
                    case 'right':
                        engine.trigger(el, elt.SWIPE_RIGHT, eventObj);
                        break;
                }
            };

            if (!startSwiping) {
                eventObj.fingerStatus = eventObj.swipe = 'start';
                startSwiping = true;
                engine.trigger(el, smrEventList.SWIPE_START, eventObj);
            } else if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = eventObj.swipe = 'move';
                engine.trigger(el, smrEventList.SWIPING, eventObj);

                if (touchTime > config.swipeTime && touchTime < config.swipeTime + 50 && distance > config.swipeMinDistance) {
                    swipeTo();
                    engine.trigger(el, smrEventList.SWIPE, eventObj, false);
                }
            } else if (utils.isTouchEnd(ev) || ev.type === 'mouseout') {
                eventObj.fingerStatus = eventObj.swipe = 'end';
                engine.trigger(el, smrEventList.SWIPE_END, eventObj);

                if (config.swipeTime > touchTime && distance > config.swipeMinDistance) {
                    swipeTo();
                    engine.trigger(el, smrEventList.SWIPE, eventObj, false);
                }
            }
        }

        if (config.drag) {
            if (!startDrag) {
                eventObj.fingerStatus = eventObj.swipe = 'start';
                startDrag = true;
                engine.trigger(el, smrEventList.DRAGSTART, eventObj);
            } else if (utils.isTouchMove(ev)) {
                eventObj.fingerStatus = eventObj.swipe = 'move';
                engine.trigger(el, smrEventList.DRAG, eventObj);
            } else if (utils.isTouchEnd(ev)) {
                eventObj.fingerStatus = eventObj.swipe = 'end';
                engine.trigger(el, smrEventList.DRAGEND, eventObj);
            }

        }
    },
    tap: function(ev) {
        var el = ev.target;
        if (config.tap) {
            var now = Date.now();
            var touchTime = now - startTime;
            var distance = utils.getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);

            clearTimeout(__holdTimer);
            var isDoubleTap = (function() {
                if (__prev_tapped_pos && config.doubleTap && (startTime - __prev_tapped_end_time) < config.maxDoubleTapInterval) {
                    var doubleDis = utils.getDistance(__prev_tapped_pos, pos.start[0]);
                    if (doubleDis < 16) return true;
                }
                return false;
            })();

            if (isDoubleTap) {
                clearTimeout(__tapTimer);
                engine.trigger(el, smrEventList.DOUBLE_TAP, {
                    type: smrEventList.DOUBLE_TAP,
                    originEvent: ev,
                    position: pos.start[0]
                });
                return;
            }

            if (config.tapMaxDistance < distance) return;

            if (config.holdTime > touchTime && utils.getFingers(ev) <= 1) {
                __tapped = true;
                __prev_tapped_end_time = now;
                __prev_tapped_pos = pos.start[0];
                __tapTimer = setTimeout(function() {
                        engine.trigger(el, smrEventList.TAP, {
                            type: smrEventList.TAP,
                            originEvent: ev,
                            fingersCount: utils.getFingers(ev),
                            position: __prev_tapped_pos
                        });
                    },
                    config.tapTime);
            }
        }
    },
    hold: function(ev) {
        var el = ev.target;
        if (config.hold) {
            clearTimeout(__holdTimer);

            __holdTimer = setTimeout(function() {
                    if (!pos.start) return;
                    var distance = utils.getDistance(pos.start[0], pos.move ? pos.move[0] : pos.start[0]);
                    if (config.tapMaxDistance < distance) return;

                    if (!__tapped) {
                        engine.trigger(el, "hold", {
                            type: 'hold',
                            originEvent: ev,
                            fingersCount: utils.getFingers(ev),
                            position: pos.start[0]
                        });
                    }
                },
                config.holdTime);
        }
    }
};

var handlerOriginEvent = function(ev) {

    var el = ev.target;
    switch (ev.type) {
        case 'touchstart':
        case 'mousedown':
            __rotation_single_start = [];
            __touchStart = true;
            if (!pos.start || pos.start.length < 2) {
                pos.start = utils.getPosOfEvent(ev);
            }
            if (utils.getFingers(ev) >= 2) {
                __initial_angle = parseInt(utils.getAngle180(pos.start[0], pos.start[1]), 10);
            }

            startTime = Date.now();
            startEvent = ev;
            __offset = {};

            var box = el.getBoundingClientRect();
            var docEl = document.documentElement;
            __offset = {
                top: box.top + (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0),
                left: box.left + (window.pageXOffset || docEl.scrollLeft) - (docEl.clientLeft || 0)
            };

            gestures.hold(ev);
            break;
        case 'touchmove':
        case 'mousemove':
            if (!__touchStart || !pos.start) return;
            pos.move = utils.getPosOfEvent(ev);
            if (utils.getFingers(ev) >= 2) {
                gestures.pinch(ev);
            } else if (__rotation_single_finger) {
                gestures.rotateSingleFinger(ev);
            } else {
                gestures.swipe(ev);
            }
            break;
        case 'touchend':
        case 'touchcancel':
        case 'mouseup':
        case 'mouseout':
            if (!__touchStart) return;
            endEvent = ev;

            if (startPinch) {
                gestures.pinch(ev);
            } else if (__rotation_single_finger) {
                gestures.rotateSingleFinger(ev);
            } else if (startSwiping) {
                gestures.swipe(ev);
            } else {
                gestures.tap(ev);
            }

            utils.reset();
            __initial_angle = 0;
            __rotation = 0;
            if (ev.touches && ev.touches.length === 1) {
                __touchStart = true;
                __rotation_single_finger = true;
            }
            break;
    }
};