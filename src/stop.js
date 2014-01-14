// Object representing a single stop on the tour.
var Stop = function (stopData) {
    // Main text.
    this.headline = stopData.headline || '';
    // Supporting copy.
    this.message = stopData.message || '';

    this.$el = $(stopData.selector);

    if (this.$el.length !== 1) {
        throw new Error(
            "The stop '" + this.headline + " - " + this.message +
            "' is not present in the DOM, or more than one node was found."
        );
    }

    this._updatePositionalData();
};

Stop.prototype.update = function () {
    this._updatePositionalData();
};

Stop.prototype._updatePositionalData = function () {
    // {width, height} of the $el including borders.
    this.sizeOf$el = { width: this.$el.outerWidth(), height: this.$el.outerHeight() };

    // {top, right, bottom, left} of the $el relative to the document.
    this.positionOf$el = this.$el.offset();
    this.positionOf$el.top = parseInt(this.positionOf$el.top);
    this.positionOf$el.right = parseInt($(document).width() - (this.positionOf$el.left + this.sizeOf$el.width));
    this.positionOf$el.bottom = parseInt($(document).height() - (this.positionOf$el.top + this.sizeOf$el.height));
    this.positionOf$el.left = parseInt(this.positionOf$el.left);

    // {top, left} center point of the $el relative to the document.
    this.centerOf$el = {
        top: (this.sizeOf$el.height / 2) + this.positionOf$el.top,
        left: (this.sizeOf$el.width / 2) + this.positionOf$el.left
    };
};
