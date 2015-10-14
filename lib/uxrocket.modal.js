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
                  '    <div class="uxr-modal-drag uxr-modal-hide"></div>' +
                  '    <div class="uxr-modal-content"></div>' +
                  '    <a href="#" class="uxr-modal-close uxr-modal-hide"></a>' +
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
            close        : true,
            iframe       : false,
            html         : false,
            fixed        : false,

            onReady : false,
            onOpen  : false,
            onStart : false,
            onLoad  : false,
            onClose : false,
            onRemove: false
        },

        events = {
            click     : 'click.' + rocketName,
            touchstart: 'touchstart.' + rocketName,
            toucemove : 'touchmove.' + rocketName,
            touchend  : 'touchend.' + rocketName,
            mousedown : 'mousedown.' + rocketName,
            mousemove : 'mousemove.' + rocketName,
            mouseup   : 'mouseup.' + rocketName,
            open      : 'uxropen.' + rocketName,
            start     : 'uxrstart.' + rocketName,
            load      : 'uxrload.' + rocketName,
            close     : 'uxrclose.' + rocketName,
            ready     : 'uxrready.' + rocketName,
            resize    : 'uxrresize.' + rocketName,
            remove    : 'uxrremove.' + rocketName
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
                drag     : 'drag',
                content  : 'content',
                loading  : 'loading',
                close    : 'close',
                hide     : 'hide'
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

        // direct call
        if(this.el === null) {
            this.bindGenericActions();
            this.prepare();
        }

        this.emitEvent('ready');
    };

    Modal.prototype.bindUIActions = function() {
        var _this = this;

        if(this.el) {
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
                    _this.onOpen();
                })
                .on(events.start, function() {
                    _this.onStart();
                })
                .on(events.load, function() {
                    _this.onLoad();
                })
                .on(events.close, function() {
                    _this.onClose();
                })
                .on(events.remove, function() {
                    _this.onRemove();
                });
        }

        $('body')
            .on(events.click + ' ' + events.touchstart, '#uxr-modal-overlay', function() {
                modal.closeFromOverlay();
            })
            .on(events.click + ' ' + events.touchstart, '#uxr-modal-instance-' + _this._instance + ' .' + utils.getClassname('close'), function(e) {
                e.preventDefault();
                _this.close();
            })
            .on(events.mousedown + ' ' + events.touchstart, '#uxr-modal-instance-' + _this._instance + ' .' + utils.getClassname('drag'), function(e) {
                e.preventDefault();
                modal.move.start(_this, e);
            });

        $(document)
            .on(events.mousemove + ' ' + events.touchmove, function(e) {
                modal.move.drag(e);
            }).on(events.mouseup + ' ' + events.touchend, function() {
                modal.move.stop();
            });
    };

    Modal.prototype.bindGenericActions = function() {
        var _this = this;

        $('body')
            .on(events.open, function() {
                _this.onOpen();
            })
            .on(events.start, function() {
                _this.onStart();
            })
            .on(events.load, function() {
                _this.onLoad();
            })
            .on(events.close, function() {
                _this.onClose();
            })
            .on(events.remove, function() {
                _this.onRemove();
            });
    };

    Modal.prototype.prepare = function() {
        var css = {},
            $overlay = $('#uxr-modal-overlay'),
            _content = content.replace('{{id}}', 'uxr-modal-instance-' + this._instance),
            _appendTo = 'body';

        if(this.options.appendTo !== 'body') {
            _appendTo = ($(utils.escapeSelector(this.options.appendTo)).length === 0) ? 'body' : this.options.appendTo;
        }

        if(!this.options.allowMultiple && modal.isOnlyInstance()) {
            modal.closeFromOverlay();
        }

        if(this.options.blockUI) {
            if($overlay.length === 0) {
                $(utils.escapeSelector(_appendTo)).append(overlay);
            }
            else {
                $overlay.removeClass(utils.getClassname('hide'));
            }
        }

        if(this.$content === null) {
            this.$content = $(_content);

            if(this.options.fixed) {
                css.position = 'fixed';
            }

            if(this.options.maxWidth !== '') {
                css.maxWidth = this.options.maxWidth;
            }

            if(this.options.maxHeight !== '') {
                css.maxHeight = this.options.maxHeight;
            }

            if(Object.keys(css).length > 0) {
                this.$content.css(css);
            }

            $(utils.escapeSelector(_appendTo)).append(this.$content);
        }

        else {
            this.$content.removeClass(utils.getClassname('hide'));
        }

        this.$content.addClass(utils.getClassname('loading')).find('.' + utils.getClassname('content')).html('');

        modal.registerInstance(this);

        this.open();
    };

    Modal.prototype.open = function() {
        this.emitEvent('open');
        this.get();
    };

    Modal.prototype.get = function() {
        var _this = this,
            iframe;

        if(this.options.iframe) {
            this.options.width = this.options.width || 800;
            this.options.height = this.options.height || 600;

            iframe = '<iframe src="' + this.href + '" frameborder="0" width="100%" height="100%"></iframe>';
            this.html = iframe;
            _this.emitEvent('load');
        }

        else if(!this.isInpage()) {
            $.get(this.href).done(function(data) {
                _this.html = data;
                setTimeout(function() {
                    _this.emitEvent('load');
                });
            });
        }
        else if(this.href !== false) {
            var $target = $(utils.escapeSelector(this.href)),
                $ph = $('<div>').addClass('.' + utils.getClassname('hide')).insertBefore($target);

            this.$el.one(events.close, function() {
                $ph.replaceWith($target);
            });

            this.html = $target;

            _this.emitEvent('load');
        }
        else {
            this.html = this.options.html;
            _this.emitEvent('load');
        }
    };

    Modal.prototype.load = function() {
        var loadedContent = this.$content.find('.' + utils.getClassname('content'));

        loadedContent.html();

        this.$content.removeClass(utils.getClassname('loading'));

        if(this.options.close) {
            this.$content
                .find('.' + utils.getClassname('close'))
                .removeClass(utils.getClassname('hide'));
        }

        if(this.options.allowMultiple) {
            this.$content
                .find('.' + utils.getClassname('drag'))
                .removeClass(utils.getClassname('hide'));
        }

        loadedContent.append(this.html);

        this.resize();
    };

    Modal.prototype.close = function() {
        if(modal.isOnlyInstance()) {
            $('#uxr-modal-overlay').addClass(utils.getClassname('hide'));
        }

        this.$content
            .addClass(utils.getClassname('hide'))
            .find('.' + utils.getClassname('close'))
            .addClass(utils.getClassname('hide'));

        modal.close(this);

        this.emitEvent('close');
    };

    Modal.prototype.resize = function() {
        var css = {},
            loadedContent = this.$content.find('.' + utils.getClassname('content'));

        if(this.options.width !== '') {
            css.width = this.options.width;
        }

        if(this.options.height !== '') {
            css.height = this.options.height;
        }

        loadedContent.css(css);

        if(this.$content.height() < loadedContent.height()) {
            this.$content.css('overflowY', 'scroll');
        }
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
        var $el = (this.el !== null) ? this.$el : $('body');

        $el.trigger(events[which]);
    };

    Modal.prototype.getOpenedInstances = function() {
        return openedInstances;
    };

    var modal = {
        registerInstance: function(instance) {
            openedInstances[instance._instance] = instance;
            instance.previousInstance = openedInstances.lastInstance || instance._instance;
            openedInstances.lastInstance = instance._instance;
        },
        close           : function(instance) {
            openedInstances.lastInstance = instance.previousInstance;
            delete openedInstances[instance._instance];
        },
        closeFromOverlay: function() {
            var activeInstance = openedInstances[openedInstances.lastInstance];

            if(this.hasInstances()) {
                if(!activeInstance.options.overlayClose) {
                    return;
                }

                activeInstance.close();
            }
        },
        hasInstances    : function() {
            return Object.keys(openedInstances).length > 1;
        },
        isOnlyInstance  : function() {
            return (Object.keys(openedInstances).length - 1) === 1;
        },
        move            : {
            pos     : {},
            selected: false,
            previous: false,
            start   : function(instance, e) {
                var pointer = this.pointer(e);

                this.selected = instance;
                this.selected.$content.css('zIndex', 10001);
                this.pos.top = pointer.y - this.selected.$content[0].offsetTop;
                this.pos.left = pointer.x - this.selected.$content[0].offsetLeft;

                if(!this.previous) {
                    this.previous = instance;
                }
                else {
                    this.previous.$content.css('zIndex', 10000);
                }
            },
            drag    : function(e) {
                var pointer = this.pointer(e);

                if(this.selected) {
                    this.selected.$content[0].style.top = pointer.y + 'px';
                    this.selected.$content[0].style.left = pointer.x + 'px';
                }
            },
            stop    : function() {
                if(this.selected) {
                    this.previous = this.selected;
                    this.selected = false;
                }
            },
            pointer : function(e) {
                var out = {x: 0, y: 0};
                if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    out.x = touch.pageX;
                    out.y = touch.pageY;
                } else if(e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
                    out.x = e.pageX;
                    out.y = e.pageY;
                }
                return out;
            }
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
            new Modal(null, options, null);
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

    ux.resize = function() {
        var activeInstance = openedInstances[openedInstances.lastInstance];

        if(modal.hasInstances()) {
            activeInstance.resize();
        }
    };

    ux.close = function() {
        var activeInstance = openedInstances[openedInstances.lastInstance];

        if(modal.hasInstances()) {
            activeInstance.close();
        }
    };

    ux.version = '1.2.2';

    ux.settings = defaults;
}));