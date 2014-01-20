'use strict';
(function(root, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory); //Register as a module.
    } else {
        root.touch = factory();
    }
}(this, function() {