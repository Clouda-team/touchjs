/** 底层事件绑定/代理支持  */
var engine = {
    proxyid: 0,
    proxies: [],
    trigger: function(el, evt, detail) {

        detail = detail || {};
        var e, opt = {
                bubbles: true,
                cancelable: true,
                detail: detail
            };

        try {
            if (typeof CustomEvent !== 'undefined') {
                e = new CustomEvent(evt, opt);
                if (el) {
                    el.dispatchEvent(e);
                }
            } else {
                e = document.createEvent("CustomEvent");
                e.initCustomEvent(evt, true, true, detail);
                if (el) {
                    el.dispatchEvent(e);
                }
            }
        } catch (ex) {
            console.warn("Touch.js is not supported by environment.");
        }
    },
    bind: function(el, evt, handler) {
        el.listeners = el.listeners || {};
        if (!el.listeners[evt]) {
            el.listeners[evt] = [handler];
        } else {
            el.listeners[evt].push(handler);
        }
        var proxy = function(e) {
            if (utils.env.ios7) {
                utils.forceReflow();
            }
            e.originEvent = e;
            for (var p in e.detail) {
                if (p !== 'type') {
                    e[p] = e.detail[p];
                }
            }
            e.startRotate = function() {
                __rotation_single_finger = true;
            };
            var returnValue = handler.call(e.target, e);
            if (typeof returnValue !== "undefined" && !returnValue) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        handler.proxy = handler.proxy || {};
        if (!handler.proxy[evt]) {
            handler.proxy[evt] = [this.proxyid++];
        } else {
            handler.proxy[evt].push(this.proxyid++);
        }
        this.proxies.push(proxy);
        if (el.addEventListener) {
            el.addEventListener(evt, proxy, false);
        }
    },
    unbind: function(el, evt, handler) {
        if (!handler) {
            var handlers = el.listeners[evt];
            if (handlers && handlers.length) {
                handlers.forEach(function(handler) {
                    el.removeEventListener(evt, handler, false);
                });
            }
        } else {
            var proxyids = handler.proxy[evt];
            if (proxyids && proxyids.length) {
                proxyids.forEach(function(proxyid) {
                    if (el.removeEventListener) {
                        el.removeEventListener(evt, this.proxies[this.proxyid], false);
                    }
                });
            }
        }
    },
    delegate: function(el, evt, sel, handler) {
        var proxy = function(e) {
            var target, returnValue;
            e.originEvent = e;
            for (var p in e.detail) {
                if (p !== 'type') {
                    e[p] = e.detail[p];
                }
            }
            e.startRotate = function() {
                __rotation_single_finger = true;
            };
            var integrateSelector = utils.getSelector(el) + " " + sel;
            var match = utils.matchSelector(e.target, integrateSelector);
            var ischild = utils.matchSelector(e.target, integrateSelector + " " + e.target.nodeName);
            if (!match && ischild) {
                if (utils.env.ios7) {
                    utils.forceReflow();
                }
                target = e.target;
                while (!utils.matchSelector(target, integrateSelector)) {
                    target = target.parentNode;
                }
                returnValue = handler.call(e.target, e);
                if (typeof returnValue !== "undefined" && !returnValue) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            } else {
                if (utils.env.ios7) {
                    utils.forceReflow();
                }
                if (match || ischild) {
                    returnValue = handler.call(e.target, e);
                    if (typeof returnValue !== "undefined" && !returnValue) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            }
        };
        handler.proxy = handler.proxy || {};
        if (!handler.proxy[evt]) {
            handler.proxy[evt] = [this.proxyid++];
        } else {
            handler.proxy[evt].push(this.proxyid++);
        }
        this.proxies.push(proxy);
        el.listeners = el.listeners || {};
        if (!el.listeners[evt]) {
            el.listeners[evt] = [proxy];
        } else {
            el.listeners[evt].push(proxy);
        }
        if (el.addEventListener) {
            el.addEventListener(evt, proxy, false);
        }
    },
    undelegate: function(el, evt, sel, handler) {
        if (!handler) {
            var listeners = el.listeners[evt];
            listeners.forEach(function(proxy) {
                el.removeEventListener(evt, proxy, false);
            });
        } else {
            var proxyids = handler.proxy[evt];
            if (proxyids.length) {
                proxyids.forEach(function(proxyid) {
                    if (el.removeEventListener) {
                        el.removeEventListener(evt, this.proxies[this.proxyid], false);
                    }
                });
            }
        }
    }
};