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
    this.arrowClass = '';  // This class will be applied to the element for the css pointer arrow.
};

Plaque.prototype.open = function (positionOfStop, centerOfStop, sizeOfStop, headline, message, stopNumber) {
    // Call update first so the element is resized with new content before gettings it's size checked.
    this.updateContent(headline, message, stopNumber);

    var $elHeight = this.$el.outerHeight();
    var $elWidth = this.$el.outerWidth();
    var gaps = {
        top: positionOfStop.top - $elHeight,
        right: positionOfStop.right - $elWidth,
        bottom: positionOfStop.bottom - $elHeight,
        left: positionOfStop.left - $elWidth
    };

    var optimalDirection = this._getOptimalDirection(gaps);
    var top, left, arrowClass;
    switch (optimalDirection) {
        case 'left':
            top = centerOfStop.top - ($elHeight / 2);
            left = (positionOfStop.left - $elWidth);
            arrowClass = 'plaque_left';
            break;

        case 'right':
            top = centerOfStop.top - ($elHeight / 2);
            left = (positionOfStop.left + sizeOfStop.width);
            arrowClass = 'plaque_right';
            break;

        case 'top':
            top = (positionOfStop.top - $elHeight);
            left = centerOfStop.left - ($elWidth / 2);
            arrowClass = 'plaque_above';
            break;

        case 'bottom':
            top = (positionOfStop.top + sizeOfStop.height);
            left = centerOfStop.left - ($elWidth / 2);
            arrowClass = 'plaque_below';
            break;
    }

    // if (top + $elHeight > $(window).innerHeight()) {
    //     top -= sizeOfStop.height;
    //     arrowClass = '';
    // }

    this.$el.css({
            top  : top,
            left : left
        }).removeClass(this.arrowClass).addClass(arrowClass)
        .fadeIn(20);

    this.arrowClass = arrowClass;

    return this;
};

Plaque.prototype.close = function () {
    this.$el.hide();
    return this;
};

Plaque.prototype.updateContent = function (headline, message, stopNumber) {
    this.$headline.text(headline);
    this.$message.text(message);
    this.$stopNumber.text(stopNumber);

    return this;
};

Plaque.prototype._getOptimalDirection = function (gaps) {
    var optimalDirection = null;
    var largestGap = -1;
    for (var direction in gaps) {
        if (gaps.hasOwnProperty(direction)) {
            var value = gaps[direction];
            if (value > largestGap) {
                optimalDirection = direction;
                largestGap = value;
            }
        }
    }
    return optimalDirection;
};
