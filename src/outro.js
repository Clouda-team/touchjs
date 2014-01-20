    //init gesture
    function init() {

        var mouseEvents = 'mouseup mousedown mousemove mouseout',
            touchEvents = 'touchstart touchmove touchend touchcancel';
        var bindingEvents = utils.hasTouch ? touchEvents : mouseEvents;

        bindingEvents.split(" ").forEach(function(evt) {
            document.addEventListener(evt, handlerOriginEvent, false);
        });
    }

    init();

    var exports = {};

    exports.on = exports.bind = exports.live = _on;
    exports.off = exports.unbind = exports.die = _off;
    exports.config = config;
    exports.trigger = _dispatch;

    return exports;
}));