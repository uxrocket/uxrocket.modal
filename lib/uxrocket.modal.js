/**
 * UX Rocket Modal
 * jQuery based modal
 * @author Bilal Cinarli
 */

(function(factory) {
    'use strict';
    if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if(typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(jQuery);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    var ux,
        rocketName = 'uxrModal',

        defaults = {
            className    : '',
            href         : '',
            width        : '',
            height       : '',
            maxWidth     : '',
            maxHeight    : '',
            appendTo     : 'body',
            allowMultiple: false,
            blockUI      : true,
            overlayClose : true,
            iframe       : false,
            html         : false,

            onReady : false,
            onOpen  : false,
            onStart : false,
            onLoad  : false,
            onClose : false,
            onRemove: false
        },

        events = {
            click : 'click.' + rocketName,
            open  : 'uxropen.' + rocketName,
            start : 'uxrstart.' + rocketName,
            load  : 'uxrload.' + rocketName,
            close : 'uxrclose.' + rocketName,
            ready : 'uxrready.' + rocketName,
            resize: 'uxrresize.' + rocketName
        },

        ns = {
            prefix : 'uxr-',
            rocket : 'uxRocket',
            data   : rocketName,
            name   : 'modal',
            classes: {
                overlay  : 'overlay',
                container: 'container',
                content  : 'content',
                close    : 'close'
            }
        };

    var Modal = function(el, options, selector) {
        this._name = rocketName;
        this._defaults = defaults;

        this.el = el;
        this.$el = $(el);
        this.options = $.extend(true, {}, defaults, options, this.$el.data());
        this.selector = selector;

        this.init();
    };

    Modal.prototype.init = function() {
        var uxrocket = this.$el.data(ns.rocket) || {};

        // register plugin data to rocket
        uxrocket[ns.data] = {hasWrapper: false, ready: utils.getClassname('ready'), selector: this.selector, options: this.options};
        this.$el.data(ns.rocket, uxrocket);

        this.bindUIActions();

        this.emitEvent('ready');
    };

    Modal.prototype.bindUIActions = function() {
        this.$el.on(events.click, function() {

        });
    };

    Modal.prototype.open = function() {

    };

    Modal.prototype.close = function() {

    };

    Modal.prototype.resize = function() {

    };

    Modal.prototype.emitEvent = function(which) {
        this.$el.trigger(events[which]);
    };

    var utils = {
        callback: function(fn) {
            // if callback string is function call it directly
            if(typeof fn === 'function') {
                fn.apply(this);
            }

            // if callback defined via data-attribute, call it via new Function
            else {
                if(fn !== false) {
                    var _fn = /([a-zA-Z._$0-9]+)(\(?(.*)?\))?/.exec(fn),
                        _fn_ns = _fn[1].split('.'),
                        _args = _fn[3] ? _fn[3] : '',
                        func = _fn_ns.pop(),
                        context = _fn_ns[0] ? window[_fn_ns[0]] : window;

                    for(var i = 1; i < _fn_ns.length; i++) {
                        context = context[_fn_ns[i]];
                    }

                    return context[func](_args);
                }
            }
        },

        getStringVariable: function(str) {
            var val;
            // check if it is chained
            if(str.indexOf('.') > -1) {
                var chain = str.split('.'),
                    chainVal = window[chain[0]];

                for(var i = 1; i < chain.length; i++) {
                    chainVal = chainVal[chain[i]];
                }

                val = chainVal;
            }

            else {
                val = window[str];
            }

            return val;
        },

        getClassname: function(which) {
            return ns.prefix + ns.name + '-' + ns.classes[which];
        }
    };

    ux = $.fn.modal = $.fn.uxrmodal = $.uxrmodal = function(options) {
        var selector = this.selector;

        // direct call to dialog
        if(typeof this === 'function') {
            Modal(null, options, null);
        }

        return this.each(function() {
            if($.data(this, ns.data)) {
                return;
            }

            // Bind the plugin and attach the instance to data
            $.data(this, ns.data, new Modal(this, options, selector));
        });
    };

    ux.version = '1.0.0';

    ux.settings = defaults;
}));