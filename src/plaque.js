var MAX_DISTANCE = 50;


var PLAQUE_TEMPLATE =
    '<div class="plaque">' +
        '<div class="plaque-bd">' +
            '<div class="plaque-steps">' +
                '<span class="plaque-stopNumber js-plaque-stopNumber"></span> of ' +
                '<span class="plaque-totalStops js-plaque-totalStops"></span>' +
            '</div>' +
            '<div class="plaque-title js-plaque-title"></div>' +
            '<div class="plaque-message js-plaque-message"></div>' +
        '</div>' +
        '<div class="plaque-ft">' +
            '<div class="plaque-ft-controls">' +
                '<span class="js-tourGuide-previous">&larr; prev</span>' +
                '<span class="js-tourGuide-next">next &rarr; </span>' +
            '</div>' +
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

Plaque.prototype.open = function (offset, size, info, stopNumber) {
    // Call update first so the element is resized with new content before gettings it's size checked.
    this._updateContent(info, stopNumber);

    var plaqueHeight = this.$el.outerHeight();
    var plaqueWidth = this.$el.outerWidth();

    var top, left, arrowClass;



    if (offset.top + size.height + plaqueHeight < $(window).height()) {
        top = (offset.top + size.height) + (plaqueHeight * 1.08  < MAX_DISTANCE ? plaqueHeight * 1.08 : MAX_DISTANCE);
        left = (offset.left + (size.width / 2)) - (plaqueWidth / 2);
        arrowClass = 'plaque_below';
    }

    if ($(window).width() - (offset.left + size.width) > plaqueWidth) {
        top = (offset.top + (size.height / 2)) - (plaqueHeight / 2);
        left = (offset.left + size.width) * 1.08;
        arrowClass = 'plaque_right';
    }

    if (offset.top > plaqueHeight) {
        top = (offset.top - plaqueHeight) - (plaqueHeight * 1.08  < MAX_DISTANCE ? plaqueHeight * 1.08 : MAX_DISTANCE);
        left = (offset.left + (size.width / 2)) - (plaqueWidth / 2);
        arrowClass = 'plaque_above';
    }

    if (offset.left > plaqueWidth) {
        top = (offset.top + (size.height / 2)) - (plaqueHeight / 2);
        left = offset.left - (plaqueWidth * 1.08);
        arrowClass = 'plaque_left';
    }

    this.$el
        .stop(false, false)
        .css({
            top  : top,
            left : left
        })
        .removeClass(this.arrowClass)
        .addClass(arrowClass)
        .fadeIn(20);

    this.arrowClass = arrowClass;

    return this;
};

Plaque.prototype.close = function () {
    this.$el.stop(false, false).hide();
    return this;
};

Plaque.prototype._updateContent = function (info, stopNumber) {
    this.$headline.text(info.headline);
    this.$message.text(info.message);
    this.$stopNumber.text(stopNumber);

    return this;
};
