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

        overlay = '<div id="uxr-modal-overlay"></div>',
        content = '<div id="{{id}}" class="uxr-modal-container uxr-modal-loading">' +
                  '    <div class="uxr-modal-content"></div>' +
                  '    <a href="#" class="uxr-modal-close"></a>' +
                  '</div>',
        openedInstances = {},

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
            resize: 'uxrresize.' + rocketName,
            remove: 'uxrremove.' + rocketName
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
                loading  : 'loading',
                close    : 'close'
            }
        };

    var Modal = function(el, options, selector) {
        this._name = rocketName;
        this._defaults = defaults;
        this._instance = instance;

        this.el = el;
        this.$el = $(el);
        this.$content = null;
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

            // do not open same modal more then once
            if(typeof openedInstances[_this._instance] !== 'undefined') {
                return;
            }

            _this.emitEvent('start');
            _this.prepare();
        })
            .on(events.ready, function() {
                _this.onReady();
            })
            .on(events.open, function() {
                _this.onOpen()
            })
            .on(events.start, function() {
                _this.onStart();
            })
            .on(events.load, function() {
                _this.onLoad()
            })
            .on(events.close, function() {
                _this.onClose();
            })
            .on(events.remove, function() {
                _this.onRemove();
            });

        $('body')
            .on(events.click, '#uxr-modal-overlay', function() {
                modal.closeAll();
            })
            .on(events.click, '#uxr-modal-instance-' + _this._instance + ' .' + utils.getClassname('close'), function(e) {
                e.preventDefault();
                _this.close();
            });
    };

    Modal.prototype.prepare = function() {
        var _this = this,
            $overlay = $('#uxr-modal-overlay'),
            _content = content.replace('{{id}}', 'uxr-modal-instance-' + this._instance);

        if($overlay.length === 0) {
            $(utils.escapeSelector(this.options.appendTo)).append(overlay);
        }
        else {
            $overlay.show();
        }

        if(this.$content === null) {
            _this.$content = $(_content);
            $(utils.escapeSelector(this.options.appendTo)).append(_this.$content);
        }

        else {
            _this.$content.show();
        }

        modal.registerInstance(this);

        this.open();
    };

    Modal.prototype.open = function() {
        this.emitEvent('open');
        this.get();
    };

    Modal.prototype.get = function() {
        var _this = this,
            iframe,
            width,
            height;

        if(this.options.iframe) {
            width = this.options.width || 800;
            height = this.options.height || 600;

            iframe = '<iframe src="' + this.href + '" frameborder="0" width="' + width + '" height="' + height + '"></iframe>';
            this.html = iframe;
            _this.emitEvent('load');
        }

        else if(!this.isInpage()) {
            $.get(this.href).done(function(data) {
                _this.html = data;
                _this.emitEvent('load');
            });
        }
        else if(this.href !== false) {
            this.html = $(utils.escapeSelector(this.href)).clone(true);
            _this.emitEvent('load');
        }
        else {
            this.html = this.options.html;
            _this.emitEvent('load');
        }
    };

    Modal.prototype.load = function() {
        this.$content
            .removeClass(utils.getClassname('loading'))
            .find('.' + utils.getClassname('content'))
            .html(this.html);

        this.resize();
    };

    Modal.prototype.close = function() {
        if(modal.isOnlyInstance()) {
            $('#uxr-modal-overlay').hide();
        }

        this.$content
            .hide()
            .find('.' + utils.getClassname('content'))
            .html('');

        modal.close(this);

        this.emitEvent('close');
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

    Modal.prototype.onReady = function() {
        utils.callback(this.options.onReady);
    };

    Modal.prototype.onOpen = function() {
        utils.callback(this.options.onOpen);
    };

    Modal.prototype.onStart = function() {
        utils.callback(this.options.onStart);
    };

    Modal.prototype.onLoad = function() {
        this.load();

        utils.callback(this.options.onLoad);
    };

    Modal.prototype.onClose = function() {
        utils.callback(this.options.onClose);
    };

    Modal.prototype.onRemove = function() {
        utils.callback(this.options.onRemove);
    };

    Modal.prototype.emitEvent = function(which) {
        this.$el.trigger(events[which]);
    };

    Modal.prototype.getOpenedInstances = function() {
        return openedInstances;
    };

    var modal = {
        registerInstance: function(instance) {
            openedInstances[instance._instance] = instance;
            instance.previousInstance = openedInstances.lastInstance || instance._instance;
            openedInstances.lastInstance = instance._instance
        },
        close           : function(instance) {
            openedInstances.lastInstance = instance.previousInstance;
            delete openedInstances[instance._instance];
        },
        closeAll        : function() {
            var activeInstance = openedInstances[openedInstances.lastInstance];

            if(Object.keys(openedInstances).length === 1) {
                return;
            }

            if(!activeInstance.options.overlayClose) {
                return;
            }

            $('#uxr-modal-overlay').hide();

            activeInstance.$content.hide();

            modal.close(activeInstance);

            activeInstance.emitEvent('close');
        },
        isOnlyInstance  : function() {
            return (Object.keys(openedInstances).length - 1) <= 1;
        }
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