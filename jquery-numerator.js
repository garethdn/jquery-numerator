/* 
 *   jQuery Numerator Plugin 0.2.0
 *   https://github.com/garethdn/jquery-numerator
 *
 *   Copyright 2013, Gareth Nolan
 *   http://ie.linkedin.com/in/garethnolan/

 *   Based on jQuery Boilerplate by Zeno Rocha with the help of Addy Osmani
 *   http://jqueryboilerplate.com
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */

;(function ( $, window, document, undefined ) {

    var pluginName = "numerator",
    defaults = {
        easing: 'swing',
        duration: 500,
        delimiter: undefined,
        rounding: 0,
        toValue: undefined,
        fromValue: undefined,
        addToQueue: false,
        onStart: function(){},
        onStep: function(){},
        onProgress: function(){},
        onComplete: function(){},
    };

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        animationQueue: [],

        processing: false,

        init: function () {

            this.parseElement();

            this.pushToQueue();

            this.setValue();
        },

        pushToQueue: function(){
            this.animationQueue.push(this.settings);
        },

        parseElement: function () {
            var elText = $(this.element).text().trim();

            this.settings.fromValue = this.format(elText);
        },

        setValue: function() {
            var self = this;

            this.processing = true;

            $.each(self.animationQueue, function(i, item){

                console.log('animation item: '+ item);

                $({value: item.fromValue}).animate({value: item.toValue}, {

                    duration: parseInt(item.duration),

                    easing: item.easing,

                    start: item.onStart,

                    step: function(now, fx) {
                        $(self.element).text(self.format(now));
                        // accepts two params - (now, fx)
                        item.onStep(now, fx);
                    },

                    // accepts three params - (animation object, progress ratio, time remaining(ms))
                    progress: item.onProgress,

                    complete: function(){
                        item.onComplete();
                        self.animationQueue.splice(0,1);
                    }
                });
            });

            this.processing = false;
        },

        format: function(value){
            var self = this;

            if ( parseInt(this.settings.rounding ) < 1) {
                value = parseInt(value);
            } else {
                value = parseFloat(value).toFixed( parseInt(this.settings.rounding) );
            }

            if (self.settings.delimiter) {
                return this.delimit(value)
            } else {
                return value;
            } 
        },

        delimit: function(value){
            var self = this;

            value = value.toString();

            if (self.settings.rounding) {
                var decimals = value.substring( (value.length - (self.settings.rounding + 1)), value.length ),
                    wholeValue = value.substring( 0, (value.length - (self.settings.rounding + 1)));

                return self.addCommas(wholeValue) + decimals;
            } else {
                return self.addCommas(value);
            }
        },

        addCommas: function(value){
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.settings.delimiter);
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        var self = this;

        return this.each(function() {

            // if the plugin exists
            if ( $.data( this, "plugin_" + pluginName ) ) {

                console.log('plugin exists');

                if ( $.data( this, "plugin_" + pluginName ).animationQueue && $.data( this, "plugin_" + pluginName ).animationQueue.length > 0 ) {
                    
                    console.log('item in animation queue');

                    var settings = $.extend( {}, defaults, options );
                    $.data( this, "plugin_" + pluginName ).pushToQueue(settings);

                    console.log($.data( this, "plugin_" + pluginName ).animationQueue);

                } else {

                    $.data(this, 'plugin_' + pluginName, null);
                    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );

                }

            } else {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }

        });
    };

})( jQuery, window, document );