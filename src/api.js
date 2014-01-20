var _on = function() {

    var evts, handler, evtMap, sel, args = arguments;
    if (args.length < 2 || args > 4) {
        return console.error("unexpected arguments!");
    }
    var els = utils.getType(args[0]) === 'string' ? document.querySelectorAll(args[0]) : args[0];
    els = els.length ? Array.prototype.slice.call(els) : [els];
    //事件绑定
    if (args.length === 3 && utils.getType(args[1]) === 'string') {
        evts = args[1].split(" ");
        handler = args[2];
        evts.forEach(function(evt) {
            if (!utils.hasTouch) {
                evt = utils.getPCevts(evt);
            }
            els.forEach(function(el) {
                engine.bind(el, evt, handler);
            });
        });
        return;
    }

    function evtMapDelegate(evt) {
        if (!utils.hasTouch) {
            evt = utils.getPCevts(evt);
        }
        els.forEach(function(el) {
            engine.delegate(el, evt, sel, evtMap[evt]);
        });
    }
    //mapEvent delegate
    if (args.length === 3 && utils.getType(args[1]) === 'object') {
        evtMap = args[1];
        sel = args[2];
        for (var evt1 in evtMap) {
            evtMapDelegate(evt1);
        }
        return;
    }

    function evtMapBind(evt) {
        if (!utils.hasTouch) {
            evt = utils.getPCevts(evt);
        }
        els.forEach(function(el) {
            engine.bind(el, evt, evtMap[evt]);
        });
    }

    //mapEvent bind
    if (args.length === 2 && utils.getType(args[1]) === 'object') {
        evtMap = args[1];
        for (var evt2 in evtMap) {
            evtMapBind(evt2);
        }
        return;
    }

    //兼容factor config
    if (args.length === 4 && utils.getType(args[2]) === "object") {
        evts = args[1].split(" ");
        handler = args[3];
        evts.forEach(function(evt) {
            if (!utils.hasTouch) {
                evt = utils.getPCevts(evt);
            }
            els.forEach(function(el) {
                engine.bind(el, evt, handler);
            });
        });
        return;
    }

    //事件代理
    if (args.length === 4) {
        var el = els[0];
        evts = args[1].split(" ");
        sel = args[2];
        handler = args[3];
        evts.forEach(function(evt) {
            if (!utils.hasTouch) {
                evt = utils.getPCevts(evt);
            }
            engine.delegate(el, evt, sel, handler);
        });
        return;
    }
};

var _off = function() {
    var evts, handler;
    var args = arguments;
    if (args.length < 1 || args.length > 4) {
        return console.error("unexpected arguments!");
    }
    var els = utils.getType(args[0]) === 'string' ? document.querySelectorAll(args[0]) : args[0];
    els = els.length ? Array.prototype.slice.call(els) : [els];

    if (args.length === 1 || args.length === 2) {
        els.forEach(function(el) {
            evts = args[1] ? args[1].split(" ") : Object.keys(el.listeners);
            if (evts.length) {
                evts.forEach(function(evt) {
                    if (!utils.hasTouch) {
                        evt = utils.getPCevts(evt);
                    }
                    engine.unbind(el, evt);
                    engine.undelegate(el, evt);
                });
            }
        });
        return;
    }

    if (args.length === 3 && utils.getType(args[2]) === 'function') {
        handler = args[2];
        els.forEach(function(el) {
            evts = args[1].split(" ");
            evts.forEach(function(evt) {
                if (!utils.hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                engine.unbind(el, evt, handler);
            });
        });
        return;
    }

    if (args.length === 3 && utils.getType(args[2]) === 'string') {
        var sel = args[2];
        els.forEach(function(el) {
            evts = args[1].split(" ");
            evts.forEach(function(evt) {
                if (!utils.hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                engine.undelegate(el, evt, sel);
            });
        });
        return;
    }

    if (args.length === 4) {
        handler = args[3];
        els.forEach(function(el) {
            evts = args[1].split(" ");
            evts.forEach(function(evt) {
                if (!utils.hasTouch) {
                    evt = utils.getPCevts(evt);
                }
                engine.undelegate(el, evt, sel, handler);
            });
        });
        return;
    }
};

var _dispatch = function(el, evt, detail) {
    var args = arguments;
    if (!utils.hasTouch) {
        evt = utils.getPCevts(evt);
    }
    var els = utils.getType(args[0]) === 'string' ? document.querySelectorAll(args[0]) : args[0];
    els = els.length ? Array.prototype.call(els) : [els];

    els.forEach(function(el) {
        engine.trigger(el, evt, detail);
    });
};