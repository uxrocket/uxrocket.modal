/**
 * UX Rocket
 * Modal Plugin
 * @author Bilal Cinarli
 *
 * @dependency jQuery Colorbox
 */

;
(function($) {

    var ux, // local shorthand

        defaults = {
            maxWidth : '90%',
            maxHeight: '90%',

            onReady   : false,
            onOpen    : false,
            onLoad    : false,
            onComplete: false,
            onCleanup : false,
            onClosed  : false
        };

    var Modal = function(el, options, selector) {
        var $el = $(el),
            opts = $.extend({}, defaults, options, $el.data(), {'selector': selector});

        callback(opts.onReady);

        /**
         * cbox event should defined as
         * onEvent: function() { event function callback }
         * our data event string reformatted to the function callback
         */
        opts.onOpen = reformatCBoxEvents(opts.onOpen);
        opts.onLoad = reformatCBoxEvents(opts.onLoad);
        opts.onComplete = reformatCBoxEvents(opts.onComplete);
        opts.onCleanup = reformatCBoxEvents(opts.onCleanup);
        opts.onClosed = reformatCBoxEvents(opts.onClosed);

        opts.className = 'uxitd-modal';

        $el.data('uxModal', opts);

        // init colorbox
        if($el.length == 0) {
            $.colorbox(opts);
        }
        else {
            $el.colorbox(opts);
        }
    };

    var reformatCBoxEvents = function(event) {
        if(event !== false && typeof event === 'string') {
            var fn = window[event.replace('()', '')];

            if(fn !== 'undefined') {
                event = function() {
                    fn();
                };
            }
        }

        return event;
    };

    // global callback
    var callback = function(fn) {
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
    };

    ux = $.fn.modal = $.uxmodal = function(options) {
        var selector = this.selector;

        // direct call to colorbox
        if(typeof this === "function") {
            Modal(null, options, null);
        }

        return this.each(function() {
            var $el = $(this),
                uxrocket = $el.data('uxRocket') || {},
                modal;

            if($el.hasClass('uxitd-modal-ready')) {
                return;
            }

            $el.addClass('uxitd-modal-ready');

            uxrocket['uxModal'] = {'hasWrapper': false, 'ready': 'uxitd-modal-ready', 'selector': selector, 'options': options};

            $el.data('uxRocket', uxrocket);
            modal = new Modal(this, options, selector);
        });
    };

    // Public methods
    ux.close = function() {
        return $.colorbox.close();
    };

    ux.resize = function(options) {
        return $.colorbox.resize(options);
    };

    ux.remove = function() {
        return $.colorbox.remove();
    };

    // version
    ux.version = "0.7.0";
    // settings
    ux.settings = defaults;
})(jQuery);