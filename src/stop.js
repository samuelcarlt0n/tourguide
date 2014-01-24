/**
@constructor
Model for a single stop on the tour.
Acts a builder for stops.

@param {Object} stopData {selector, headline, message, setup:{selector, event, class}}
                         Initail data for a stop. Only (selector && (headline || message)) are required.
*/
var Stop = function (stopData) {
    this.$el = $(stopData.selector);

   if (this.$el.length !== 1) {
        var errorMessage = "The stop {headline} - {message} is not present in the DOM, or more than one node was found.";
        throw new Error(errorMessage.replace('{headline}', this.headline).replace('{message}', this.message));
    }

    this.info = {
        headline: stopData.headline || '',
        message: stopData.message || ''
    };

    if (stopData.setup) {
        this.setup = {};
        this.setup.$el = $(stopData.setup.selector);
        this.setup.setupEvent = stopData.setup.event;
        this.setup.setupClass = stopData.setup.class;
    }
};

/**
@method
Get the offset of the stop relative to the document.

@return {Object} {top, left} in px.
*/
Stop.prototype.getOffset = function () {
    var stopOffset = this.$el.offset();
    return {
        top: parseInt(stopOffset.top, 10),
        left: parseInt(stopOffset.left, 10)
    };
};

/**
@method
Get the size of the stop.

@return {Object} {height, width} in px.
*/
Stop.prototype.getDimensions = function () {
    return {
        width: parseInt(this.$el.width(), 10),
        height: parseInt(this.$el.height(), 10)
    };
};

/**
@method
Get the scrollTo position of the stop.
Should center the element on the page if possible.

@return {Number} Scroll position of the element relative to the document.
*/
Stop.prototype.getScrollPosition = function () {
   return parseInt(this.$el.offset().top - ($(window).innerHeight() / 2), 10);
};
