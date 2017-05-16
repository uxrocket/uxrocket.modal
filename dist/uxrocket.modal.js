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
        rocketName      = 'uxrModal',
        instance        = 1,

        overlay         = '<div id="uxr-modal-overlay"></div>',
        content         = '<div id="{{id}}" class="{{container}} {{loading}} {{className}}">'                +
                          '    <div class="{{drag}} {{#if draggable}} {{hide}} {{/if}}"></div>'+
                          '     {{#if title}}'                                                 +
                          '         <h2 class="{{titleClass}}">{{title}}</h2>'                 +
                          '     {{/if}}'                                                       +
                          '    <div class="{{content}}">'                                      +
                          '        <div class="{{loadedContent}}"></div>'                      +
                          '    </div>'                                                         +
                          '    <a href="#" class="{{close}} {{hide}}"></a>'                    +
                          '</div>',
        openedInstances = {},

        defaults        = {
            className:     '',
            href:          '',
            width:         '',
            height:        '',
            maxWidth:      '',
            maxHeight:     '',
            title:         '',
            appendTo:      'body',
            allowMultiple: false,
            blockUI:       true,
            overlayClose:  true,
            close:         true,
            iframe:        false,
            html:          false,
            fixed:         false,
            draggable:     false,

            onReady:  false,
            onOpen:   false,
            onStart:  false,
            onLoad:   false,
            onClose:  false,
            onRemove: false
        },

        events          = {
            click: 'click.' + rocketName,
            wresize: 'resize.' + rocketName,
            touchstart: 'touchstart.' + rocketName,
            touchmove: 'touchmove.' + rocketName,
            touchend: 'touchend.' + rocketName,
            mousedown: 'mousedown.' + rocketName,
            mousemove: 'mousemove.' + rocketName,
            mouseup: 'mouseup.' + rocketName,
            open: 'uxropen.' + rocketName,
            start: 'uxrstart.' + rocketName,
            load: 'uxrload.' + rocketName,
            close: 'uxrclose.' + rocketName,
            ready: 'uxrready.' + rocketName,
            resize: 'uxrresize.' + rocketName,
            remove: 'uxrremove.' + rocketName
        },

        ns              = {
            prefix:  'uxr-',
            rocket:  'uxRocket',
            data:    rocketName,
            name:    'modal',
            classes: {
                ready:         'ready',
                overlay:       'overlay',
                container:     'container',
                drag:          'drag',
                content:       'content',
                title:         'title',
                loadedContent: 'loaded-content',
                loading:       'loading',
                close:         'close',
                hide:          'hide'
            }
        },

        utils           = new uxrPluginUtils({ns: ns});

    var Modal = function(el, options, selector) {
        this._name     = rocketName;
        this._defaults = defaults;
        this._instance = instance;
        this._direct   = false;

        if(el === null) {
            el           = document.createElement('a');
            this._direct = true;
        }

        this.el       = el;
        this.$el      = $(el);
        this.$content = null;
        this.options  = $.extend(true, {}, defaults, options, this.$el.data());
        this.href     = this.options.href || this.$el.attr('href') || false;
        this.selector = selector;

        instance++;

        this.init();
    };

    Modal.prototype.init = function() {
        var uxrocket = this.$el.data(ns.rocket) || {};

        // register plugin data to rocket
        uxrocket[ns.data] = {
            hasWrapper: false,
            ready:      utils.getClassname('ready'),
            selector:   this.selector,
            options:    this.options
        };
        this.$el.data(ns.rocket, uxrocket);

        this.bindUIActions();

        this.$el.addClass(utils.getClassname('ready'));

        this.emitEvent('ready');

        if(this._direct === true) {
            this.prepare();
        }
    };

    Modal.prototype.bindUIActions = function() {
        var _this = this,
            dragTimer;

        this.$el
            .on(events.click, function(e) {
                e.preventDefault();

                // do not open same modal more then once
                if(typeof openedInstances[_this._instance] !== 'undefined') {
                    return;
                }

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
                if (dragTimer) {
                    clearTimeout(dragTimer);
                }
                dragTimer = setTimeout(function() {
                    modal.move.drag(e);
                }, 100);
            }).on(events.mouseup + ' ' + events.touchend, function() {
            modal.move.stop();
        });

        $(window).on(events.wresize, function() {
            if(openedInstances[_this._instance] !== undefined) {
                _this.resize();
            }
        });
    };

    Modal.prototype.unbindUIActions = function() {
        this.emitEvent('remove');
        this.$el.off('.' + rocketName);
    };

    Modal.prototype.prepare = function() {
        var css       = {},
            $overlay  = $('#uxr-modal-overlay'),
            data      = {
                id: 'uxr-modal-instance-' + this._instance,
                container:     utils.getClassname('container'),
                loading:       utils.getClassname('loading'),
                drag:          utils.getClassname('drag'),
                hide:          utils.getClassname('hide'),
                content:       utils.getClassname('content'),
                titleClass:    utils.getClassname('title'),
                loadedContent: utils.getClassname('loadedContent'),
                close:         utils.getClassname('close'),
                title:         !!this.options.title ? this.options.title : false,
                draggable:     this.options.draggable === 'true' ? false : true,
                className:     this.options.className
            },
            _content  = utils.render(content, data),
            _appendTo = 'body';

        this.emitEvent('start');

        if(this.options.appendTo !== 'body') {
            _appendTo = ($(utils.escapeSelector(this.options.appendTo)).length === 0) ? 'body' : this.options.appendTo;
        }

        if(!this.options.allowMultiple && modal.isOnlyInstance()) {
            modal.closeInstance();
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

        this.$content.addClass(utils.getClassname('loading')).find('.' + utils.getClassname('loadedContent')).html('');

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
            this.options.width  = this.options.width || 800;
            this.options.height = this.options.height || 600;

            iframe    = '<iframe src="' + this.href + '" frameborder="0" width="100%" height="100%"></iframe>';
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
            this.$target = $(utils.escapeSelector(this.href));
            this.$ph     = $('<div id="uxr-modal-placeholder-' + this._instance + '" class="' + utils.getClassname('hide') + '">').insertBefore(this.$target);

            this.html = this.$target;

            _this.emitEvent('load');
        }
        else {
            this.html = this.options.html;
            _this.emitEvent('load');
        }
    };

    Modal.prototype.load = function() {
        var loadedContent = this.$content.find('.' + utils.getClassname('loadedContent'));

        loadedContent.html('');

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

        this.$content.find('#uxr-notifications').remove();

        modal.close(this);

        if(this.$ph) {
            this.$ph.replaceWith(this.$target);
            delete this.$ph;
            delete this.$target;
        }

        if(this._direct) {
            this.removeContent();
        }

        this.emitEvent('close');
    };

    Modal.prototype.resize = function() {
        var css           = {},
            content       = this.$content.find('.' + utils.getClassname('content')),
            loadedContent = this.$content.find('.' + utils.getClassname('loadedContent')),
            height,
            innerWidth,
            innerHeight;

        content.height('auto');

        height = this.$content.height();

        if(this.options.width !== '') {
            css.width = this.options.width;
        }

        if(this.options.height !== '') {
            css.height = this.options.height;
        }

        loadedContent.css(css);

        innerWidth  = loadedContent.css('position', 'absolute').width();
        innerHeight = loadedContent.height();
        loadedContent.css('position', 'relative');

        if(height < innerHeight && content.width() < innerWidth) {
            content.height(height);
            content.css('overflow', 'scroll');
        }

        else if(height < innerHeight) {
            content.height(height);
            content.css('overflowY', 'scroll');
        }

        else if(content.width() < innerWidth) {
            content.css('overflowX', 'scroll');
        }

        this.emitEvent('resize');
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
                var loc  = window.location.href.replace(location.hash, '').replace(location.protocol, ''),
                    test = this.href.replace(location.hash, '').replace(location.protocol, '');

                if(loc === test) {
                    this.inpage = true;
                }
            }
        }

        return this.inpage;
    };

    Modal.prototype.remove = function() {
        this.removeClasses();
        this.removeContent();
        this.unbindUIActions();
        this.removeInstance();
    };

    Modal.prototype.removeClasses = function() {
        this.$el.removeClass(utils.getClassname('ready'));
    };

    Modal.prototype.removeContent = function() {
        if(this.$content !== null) {
            this.$content.remove();
        }
    };

    Modal.prototype.removeInstance = function() {
        delete this.$el.data()[ns.data];
        delete this.$el.data(ns.rocket)[ns.data];
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

        if(this._direct) {
            $(document).trigger(events[which]);
        }
    };

    Modal.prototype.getOpenedInstances = function() {
        return openedInstances;
    };

    var modal = {
        registerInstance: function(instance) {
            openedInstances[instance._instance] = instance;
            instance.previousInstance           = modal.isOnlyInstance() ? instance : (openedInstances.lastInstance || instance);
            openedInstances.lastInstance        = instance;
        },
        close:            function(instance) {
            openedInstances.lastInstance = instance.previousInstance;
            delete openedInstances[instance._instance];
        },
        closeFromOverlay: function() {
            if(openedInstances.lastInstance.options.overlayClose) {
                this.closeInstance();
            }
        },
        closeInstance:    function() {
            if(this.hasInstances()) {
                openedInstances.lastInstance.close();
            }
        },
        hasInstances:     function() {
            return Object.keys(openedInstances).length > 1;
        },
        isOnlyInstance:   function() {
            return (Object.keys(openedInstances).length - 1) === 1;
        },
        move:             {
            pos:      {},
            selected: false,
            previous: false,
            start:    function(instance, e) {
                var pointer = this.pointer(e);

                this.selected = instance;
                this.selected.$content.css('zIndex', 10001);
                this.pos.top  = pointer.y - this.selected.$content[0].offsetTop;
                this.pos.left = pointer.x - this.selected.$content[0].offsetLeft;

                if(!this.previous) {
                    this.previous = instance;
                }
                else {
                    this.previous.$content.css('zIndex', 10000);
                }
            },
            drag:     function(e) {
                var pointer = this.pointer(e),
                    scrollTop = $(window).scrollTop();

                if(this.selected) {
                    this.selected.$content[0].style.top  = pointer.y - scrollTop + (this.selected.$content.height() / 2) + 'px';
                    this.selected.$content[0].style.left = pointer.x + 'px';
                }
            },
            stop:     function() {
                if(this.selected) {
                    this.previous = this.selected;
                    this.selected = false;
                }
            },
            pointer:  function(e) {
                var out = {x: 0, y: 0};
                if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    out.x     = touch.pageX;
                    out.y     = touch.pageY;
                } else if(e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
                    out.x = e.pageX;
                    out.y = e.pageY;
                }
                return out;
            }
        }
    };

    ux = $.fn.modal = $.fn.uxrmodal = $.uxrmodal = function(options) {
        var selector = this.selector;

        // direct call to dialog
        if(typeof this === 'function') {
            return new Modal(null, options, null);
        }

        else {
            return this.each(function() {
                if($.data(this, ns.data)) {
                    return;
                }

                // Bind the plugin and attach the instance to data
                $.data(this, ns.data, new Modal(this, options, selector));
            });
        }
    };

    ux.remove = function(el) {
        var $el = typeof el === 'undefined' ? $('.' + utils.getClassname('ready')) : $(el);

        $el.each(function() {
            $(this).data(ns.data).remove();
        });
    };

    ux.resize = function() {
        var activeInstance = openedInstances.lastInstance;

        if(modal.hasInstances()) {
            activeInstance.resize();
        }
    };

    ux.close = function() {
        var activeInstance = openedInstances.lastInstance;

        if(modal.hasInstances()) {
            activeInstance.close();
        }
    };

    ux.getInstances = function() {
        return openedInstances;
    };

    ux.version = '1.6.3';

    ux.settings = defaults;
}));
