// Percentage of distance away from spotlight to push the plaque.
var DISTANCE_MULTIPLIER = 1.08;
// Maximum distance the tooltap can be from the edge of a stop in pixels.
var MAX_DISTANCE = 50;

// Not totally thrilled with string concat'ing templates. If the project allows, this could and
// should be replaced with an actual template.
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


/**
@constructor
Plaque is the tooltip like feature of the tour.

@param {String} template   Currently expects a string based html template.
@param {Number} totalStops Total number of stops on the tour.
*/
var Plaque = function (template, totalStops) {
    template = template || PLAQUE_TEMPLATE;
    this.$el = $(template).appendTo('body');
    this.$headline = this.$el.find('.js-plaque-title');
    this.$message = this.$el.find('.js-plaque-message');
    this.$stopNumber = this.$el.find('.js-plaque-stopNumber');
    this.$totalStops = this.$el.find('.js-plaque-totalStops').text(totalStops);

    /**
    @private
    This class will be applied to the element for the css pointer arrow.
    */
    this._arrowClass = '';
};

/**
@method
A @public callable to open the plaque. Does the heavy lifting bt delegates actually
opening to a private method.

@param  {Object} offset     {top, left} in px
@param  {Object} size       {width, height} in px
@param  {Object} info       {headline, message}
@param  {Number} stopNumber The 1-based index of the stop on the tour.
*/
Plaque.prototype.open = function (offset, size, info, stopNumber) {
    // Call update first so the element is resized with new content before gettings it's size checked.
    this._updateContent(info, stopNumber);

    var plaqueHeight = this.$el.outerHeight();
    var plaqueWidth = this.$el.outerWidth();

    // If the plaque opens on the left or the right side of the spotlight, the top value will be shared.
    var OPEN_LEFT_OR_OPEN_RIGHT_TOP_VALUE = (offset.top + (size.height / 2)) - (plaqueHeight / 2);
    // If the plaque opens above or below the spotlight, the left value will be shared.
    var OPEN_ABOVE_OR_OPEN_BELOW_LEFT_VALUE = (offset.left + (size.width / 2)) - (plaqueWidth / 2);

    var top, left, arrowClass;

    // Open below
    if (offset.top + size.height + plaqueHeight < $(window).height()) {
        top = (offset.top + size.height) + (plaqueHeight * DISTANCE_MULTIPLIER < MAX_DISTANCE ?
                                                           (plaqueHeight * DISTANCE_MULTIPLIER) : MAX_DISTANCE);
        left = OPEN_ABOVE_OR_OPEN_BELOW_LEFT_VALUE;
        arrowClass = 'plaque_below';
    }

    // Open to the right
    if ($(window).width() - (offset.left + size.width) > plaqueWidth) {
        top = OPEN_LEFT_OR_OPEN_RIGHT_TOP_VALUE;
        left = (offset.left + size.width) * DISTANCE_MULTIPLIER;
        arrowClass = 'plaque_right';
    }

    // Open above
    if (offset.top > plaqueHeight) {
        top = (offset.top - plaqueHeight) - (plaqueHeight * DISTANCE_MULTIPLIER < MAX_DISTANCE ?
                                                            (plaqueHeight * DISTANCE_MULTIPLIER) : MAX_DISTANCE);
        left = OPEN_ABOVE_OR_OPEN_BELOW_LEFT_VALUE;
        arrowClass = 'plaque_above';
    }

    // Open to the left
    if (offset.left > plaqueWidth) {
        top = OPEN_LEFT_OR_OPEN_RIGHT_TOP_VALUE;
        left = offset.left - (plaqueWidth * DISTANCE_MULTIPLIER);
        arrowClass = 'plaque_left';
    }

    this._open({top: top, left: left}, arrowClass);
};

/**
@method
Close the plaque.

@return {Plaque}
*/
Plaque.prototype.close = function () {
    this.$el.stop(false, false).hide();

    return this;
};

/**
@private
Update the content of the plaque.

@param  {Object} info       {headline, message}
@param  {Number} stopNumber The 1-based index of the stop on the tour.
@return {Plaque}
*/
Plaque.prototype._updateContent = function (info, stopNumber) {
    this.$headline.text(info.headline);
    this.$message.text(info.message);
    this.$stopNumber.text(stopNumber);

    return this;
};

/**
@private
Opens the plaque at the given coordinates, and handles assigning the proper arrow state.

@param  {Object} offset     {top, left} in px
@param  {String} arrowClass CSS class (determines what direction the arrow points).
@return {Plaque}
*/
Plaque.prototype._open = function (offset, arrowClass) {
    this.$el
        .stop(false, false)
        .css({
            'top': top,
            'left': left
        })
        .removeClass(this._arrowClass)  // Flipping these both via toggleClass()
        .addClass(arrowClass)           // wont gaurentee what we want.
        .fadeIn(20);

    this._arrowClass = arrowClass;  // Stash away for later reference.

    return this;
};
