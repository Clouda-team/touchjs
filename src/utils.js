var utils = {};

utils.PCevts = {
    'touchstart': 'mousedown',
    'touchmove': 'mousemove',
    'touchend': 'mouseup',
    'touchcancel': 'mouseout'
};

utils.hasTouch = ('ontouchstart' in window);

utils.getType = function(obj) {
    return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
};

utils.getSelector = function(el) {
    if (el.id) {
        return "#" + el.id;
    }
    if (el.className) {
        var cns = el.className.split(/\s+/);
        return "." + cns.join(".");
    } else if (el === document) {
        return "body";
    } else {
        return el.tagName.toLowerCase();
    }
};

utils.matchSelector = function(target, selector) {
    return target.webkitMatchesSelector(selector);
};

utils.getEventListeners = function(el) {
    return el.listeners;
};

utils.getPCevts = function(evt) {
    return this.PCevts[evt] || evt;
};

utils.forceReflow = function() {
    var tempDivID = "reflowDivBlock";
    var domTreeOpDiv = document.getElementById(tempDivID);
    if (!domTreeOpDiv) {
        domTreeOpDiv = document.createElement("div");
        domTreeOpDiv.id = tempDivID;
        document.body.appendChild(domTreeOpDiv);
    }
    var parentNode = domTreeOpDiv.parentNode;
    var nextSibling = domTreeOpDiv.nextSibling;
    parentNode.removeChild(domTreeOpDiv);
    parentNode.insertBefore(domTreeOpDiv, nextSibling);
};

utils.simpleClone = function(obj) {
	return Object.create(obj);
};

utils.getPosOfEvent = function(ev) {
    if (this.hasTouch) {
        var posi = [];
        var src = null;

        for (var t = 0, len = ev.touches.length; t < len; t++) {
            src = ev.touches[t];
            posi.push({
                x: src.pageX,
                y: src.pageY
            });
        }
        return posi;
    } else {
        return [{
            x: ev.pageX,
            y: ev.pageY
        }];
    }
};

utils.getDistance = function(pos1, pos2) {
    var x = pos2.x - pos1.x,
        y = pos2.y - pos1.y;
    return Math.sqrt((x * x) + (y * y));
};

utils.getFingers = function(ev) {
    return ev.touches ? ev.touches.length : 1;
};

utils.calScale = function(pstart, pmove) {
    if (pstart.length >= 2 && pmove.length >= 2) {
        var disStart = this.getDistance(pstart[1], pstart[0]);
        var disEnd = this.getDistance(pmove[1], pmove[0]);

        return disEnd / disStart;
    }
    return 1;
};

utils.getAngle = function(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
};

utils.getAngle180 = function(p1, p2) {
    var agl = Math.atan((p2.y - p1.y) * -1 / (p2.x - p1.x)) * (180 / Math.PI);
    return (agl < 0 ? (agl + 180) : agl);
};

utils.getDirectionFromAngle = function(agl) {
    var directions = {
        up: agl < -45 && agl > -135,
        down: agl >= 45 && agl < 135,
        left: agl >= 135 || agl <= -135,
        right: agl >= -45 && agl <= 45
    };
    for (var key in directions) {
        if (directions[key]) return key;
    }
    return null;
};

utils.getXYByElement = function(el) {
    var left = 0,
        top = 0;

    while (el.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return {
        left: left,
        top: top
    };
};

utils.reset = function() {
    startEvent = moveEvent = endEvent = null;
    __tapped = __touchStart = startSwiping = startPinch = false;
    startDrag = false;
    pos = {};
    __rotation_single_finger = false;
};

utils.isTouchMove = function(ev) {
    return (ev.type === 'touchmove' || ev.type === 'mousemove');
};

utils.isTouchEnd = function(ev) {
    return (ev.type === 'touchend' || ev.type === 'mouseup' || ev.type === 'touchcancel');
};

utils.env = (function() {
    var os = {}, ua = navigator.userAgent,
        android = ua.match(/(Android)[\s\/]+([\d\.]+)/),
        ios = ua.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
        wp = ua.match(/(Windows\s+Phone)\s([\d\.]+)/),
        isWebkit = /WebKit\/[\d.]+/i.test(ua),
        isSafari = ios ? (navigator.standalone ? isWebkit : (/Safari/i.test(ua) && !/CriOS/i.test(ua) && !/MQQBrowser/i.test(ua))) : false;
    if (android) {
        os.android = true;
        os.version = android[2];
    }
    if (ios) {
        os.ios = true;
        os.version = ios[2].replace(/_/g, '.');
        os.ios7 = /^7/.test(os.version);
        if (ios[1] === 'iPad') {
            os.ipad = true;
        } else if (ios[1] === 'iPhone') {
            os.iphone = true;
            os.iphone5 = screen.height == 568;
        } else if (ios[1] === 'iPod') {
            os.ipod = true;
        }
    }
    if (wp) {
        os.wp = true;
        os.version = wp[2];
        os.wp8 = /^8/.test(os.version);
    }
    if (isWebkit) {
        os.webkit = true;
    }
    if (isSafari) {
        os.safari = true;
    }
    return os;
})();