// Object representing a single stop on the tour.
var Stop = function (stopData) {
    this.$el = $(stopData.selector);

   if (this.$el.length !== 1) {
        var errorMessage = "The stop {headline} - {message} is not present in the DOM, or more than one node was found.";
        throw new Error(errorMessage.replace('{headline}', this.headline).replace('{message}', this.message));
    }

    if (stopData.setup) {
        this.setup = {};
        this.setup.$el = $(stopData.setup.selector);
        this.setup.setupEvent = stopData.setup.event;
        this.setup.setupClass = stopData.setup.class;
    }

    this.info = {
        headline: stopData.headline || '',
        message: stopData.message || ''
    };
};

Stop.prototype.getOffset = function () {
    var stopOffset = this.$el.offset();
    return {
        top: parseInt(stopOffset.top, 10),
        left: parseInt(stopOffset.left, 10)
    };
};

Stop.prototype.getDimensions = function () {
    return {
        width: parseInt(this.$el.width(), 10),
        height: parseInt(this.$el.height(), 10)
    };
};

Stop.prototype.getScrollPosition = function () {
   return parseInt(this.$el.offset().top - ($(window).innerHeight() / 2), 10);
};
