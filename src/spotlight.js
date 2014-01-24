var FILL_COLOR = '#111111';
var FILL_OPACITY = '0.6';
var PINHOLE_PATH = 'M0,0v2000h2000V0H0z ' +  // Extra space is intentional
                   'M1000,1025c-13.807,0-25-11.193-25-25s11.193-25,25-25s25,11.193,25,25S1013.807,1025,1000,1025z';

// The minimum amount to scale the spotlight. Will vary depending on how large the SVG is.
var MINIMUM_SCALE = 1.5;

// The time (in ms) it takes the spotlight to travel from on stop to the next.
var ANIMATION_DURATION = 250;
// The easing to use during the spotlight move.
var ANIMATION_EASING = 'snap';


/**
@constructor
A spotlight is the svg layer of the tour.
*/
var Spotlight = function () {
    this.snap = Snap(2000, 2000).attr({
        'id': 'spotlight',
        'class': 'spotlight'
    });
    this.$el = $(this.snap.node);

    this.pinHole = this.snap.path(PINHOLE_PATH).attr({
        'fill': FILL_COLOR,
        'fill-opacity': FILL_OPACITY
    });
};

/**
@method
Move the stoplight to a new stop.

@param  {Object}   offset {top, left}
@param  {Object}   size   {width, height}
@return {Deferred}        jQuery deferred object.
*/
Spotlight.prototype.move = function (offset, size) {
    var d = $.Deferred();

    // Determine which side is largest, and base the scaling off of that.
    var scale = Math.max(size.width, size.height) * (0.025);
    scale = scale < MINIMUM_SCALE ? MINIMUM_SCALE : scale;

    this.$el
        .stop(false, false)
        .transition({
            'scale': scale,
            'top': ((offset.top + (size.height / 2)) - (this.$el.height() / 2)),
            'left': ((offset.left + (size.width / 2)) - (this.$el.width() / 2))
        }, ANIMATION_DURATION, ANIMATION_EASING, d.resolve);

    return d.promise();
};

/**
@method
Turn the spotlight on.
*/
Spotlight.prototype.on = function () {
    // Add the svg node and then fade in
    this.$el
        .css({'opacity': 0})  // Ensure it is transparent when re-added to the DOM.
        .appendTo('body')
        .animate({'opacity': 1}, 750);  // $.animate needs to be used here - $.transit refused to animate.
};

/**
@method
Turn the spotlight off.
*/
Spotlight.prototype.off = function () {
    // Fadeout the svg node and then detach
    this.$el.stop(false, false).transition({'opacity': 0}, 250, this.$el.detach);
};
