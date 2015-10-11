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
        instance = 1,

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
                ready    : 'ready',
                overlay  : 'overlay',
                container: 'container',
                content  : 'content',
                close    : 'close'
            }
        };

    var Modal = function(el, options, selector) {
        this._name = rocketName;
        this._defaults = defaults;
        this._instance = instance;

        this.el = el;
        this.$el = $(el);
        this.options = $.extend(true, {}, defaults, options, this.$el.data());
        this.href = this.options.href || this.$el.attr('href') || false;
        this.selector = selector;

        instance++;

        this.init();
    };

    Modal.prototype.init = function() {
        var uxrocket = this.$el.data(ns.rocket) || {};

        // register plugin data to rocket
        uxrocket[ns.data] = {hasWrapper: false, ready: utils.getClassname('ready'), selector: this.selector, options: this.options};
        this.$el.data(ns.rocket, uxrocket);

        this.bindUIActions();

        this.$el.addClass(utils.getClassname('ready'));

        this.emitEvent('ready');
    };

    Modal.prototype.bindUIActions = function() {
        var _this = this;

        this.$el.on(events.click, function(e) {
            e.preventDefault();
            _this.open();
        });
    };

    Modal.prototype.get = function() {
        var _this = this;

        if(!this.isInpage()) {
            $.get(this.href).done(function(data){
                _this.html = data;
            });
        }
        else if(this.html !== false) {
            this.html = $(utils.escapeSelector(this.href));
        }
        else {
            this.html = this.options.html;
        }
    };

    Modal.prototype.open = function() {
        this.get();
    };

    Modal.prototype.close = function() {

    };

    Modal.prototype.resize = function() {

    };

    Modal.prototype.isInpage = function() {
        if(typeof this.inpage === 'undefined') {
            this.inpage = false;

            if(this.href === false) {
                this.inpage = true;
            }

            else if(this.href.charAt(0) === '#') {
                this.inpage = true;
            }

            else {
                var loc = window.location.href.replace(location.hash, '').replace(location.protocol, ''),
                    test = this.href.replace(location.hash, '').replace(location.protocol, '');

                if(loc === test) {
                    this.inpage = true;
                }
            }
        }

        return this.inpage;
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
                    var func = new Function('return ' + fn);
                    func();
                }
            }
        },

        escapeSelector: function(selector) {
            var is_ID = selector.charAt(0) === '#',
                re = /([ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g;

            return is_ID ? '#' + selector.substring(1).replace(re, '\\$1') : selector;
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
            return;
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