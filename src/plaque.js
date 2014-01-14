var PLAQUE_TEMPLATE =
    '<div class="plaque">' +
        '<div class="plaque-title js-plaque-title"></div>' +
        '<div class="plaque-message js-plaque-message"></div>' +
        '<span class="plaque-stopNumber js-plaque-stopNumber"></span> of ' +
        '<span class="plaque-totalStops js-plaque-totalStops"></span>' +
        '<div>' +
            '<span class="js-tourGuide-previous">prev</span>' +
            '<span class="js-tourGuide-next">next</span>' +
        '</div>' +
    '</div>'
;

var Plaque = function (totalStops) {
    this.$el = $(PLAQUE_TEMPLATE).appendTo('body');
    this.$headline = this.$el.find('.js-plaque-title');
    this.$message = this.$el.find('.js-plaque-message');
    this.$stopNumber = this.$el.find('.js-plaque-stopNumber');
    this.$totalStops = this.$el.find('.js-plaque-totalStops').text(totalStops);
};

Plaque.prototype.open = function (positionOfStop, centerOfStop, sizeOfStop, headline, message, stopNumber) {
    // Call update first so the element is resized with new content before gettings it's size checked.
    this.update(headline, message, stopNumber);

    var $elHeight = this.$el.outerHeight();
    var $elWidth = this.$el.outerWidth();
    var gaps = {
        top: positionOfStop.top - $elHeight,
        right: positionOfStop.right - $elWidth,
        bottom: positionOfStop.bottom - $elHeight,
        left: positionOfStop.left - $elWidth
    };

    var top, right, bottom, left;
    var optimalSide = this._getOptimalSide(gaps);
    switch (optimalSide) {
        case 'top':
            top = positionOfStop.top - $elHeight + 'px';
            left = centerOfStop.left - ($elWidth / 2) + 'px';
            break;

        case 'right':
            top = centerOfStop.top - ($elHeight / 2) + 'px';
            left = positionOfStop.left + sizeOfStop.width + 'px';
            break;

        case 'bottom':
            top = positionOfStop.top + sizeOfStop.height + 'px';
            left = centerOfStop.left - ($elWidth / 2) + 'px';
            break;

        case 'left':
            top = centerOfStop.top - ($elHeight / 2) + 'px';
            left = positionOfStop.left - $elWidth + 'px';
            break;
    }

    // Not all properties are wanted to position any given side, this will wipe
    // any previous position values set on the $el or apply new values.
    this.$el.css({
        top    : top    || '',
        right  : right  || '',
        bottom : bottom || '',
        left   : left   || ''
    }).fadeIn(10);

    return this;
};

Plaque.prototype.close = function () {
    this.$el.fadeOut(50);
    return this;
};

Plaque.prototype.update = function (headline, message, stopNumber) {
    this.$headline.text(headline);
    this.$message.text(message);
    this.$stopNumber.text(stopNumber);

    return this;
};

Plaque.prototype._getOptimalSide = function (gaps) {
    var optimalSide = null;
    var largestGap = -1;
    for (var side in gaps) {
        if (gaps.hasOwnProperty(side)) {
            var value = gaps[side];
            if (value > largestGap) {
                optimalSide = side;
                largestGap = value;
            }
        }
    }
    return optimalSide;
};
