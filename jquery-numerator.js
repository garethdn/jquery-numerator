;(function ( $, window, document, undefined ) {

    var pluginName = "numerator",
    defaults = {
        easing: 'swing',
        duration: 500,
        delimiter: undefined,
        rounding: 0,
        toValue: undefined,
        fromValue: undefined
    };

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.parseElement();
            this.setValue();
        },

        setValue: function() {
            var self = this;

            $({value: self.settings.fromValue}).animate({value: self.settings.toValue}, {
                duration: self.settings.duration,
                easing: self.settings.easing,
                step: function(now, fx) {
                    $(self.element).text(self.format(now));
                }
            });
        },

        parseElement: function () {
            var elText = $(this.element).text().trim();

            this.settings.fromValue = this.format(elText);
        },

        format: function(value){
            if (this.settings.rounding < 1) {
                return parseInt(value);
            } else {
                return parseFloat(value).toFixed(this.settings.rounding);
            }
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( $.data( this, "plugin_" + pluginName ) ) {
                $.data(this, 'plugin_' + pluginName, null);
            }
            $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );

        });
    };

})( jQuery, window, document );