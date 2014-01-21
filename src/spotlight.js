var FILL_COLOR = '#111111';
var FILL_OPACITY = '0.6';
var PINHOLE_PATH = 'M0,0v2000h2000V0H0z ' +  // Extra space is intentional
                   'M1000,1025c-13.807,0-25-11.193-25-25s11.193-25,25-25s25,11.193,25,25S1013.807,1025,1000,1025z';

var MINIMUM_SCALE = 1.5;

var ANIMATION_DURATION = 250;
var ANIMATION_EASING = 'snap';



// Object representing a spotlight for the tour.
// Constructor
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

Spotlight.prototype.move = function (offset, size) {
    var d = $.Deferred();

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

Spotlight.prototype.on = function () {
    // Add the svg node and then fade in
    this.$el
        .css({'opacity': 0})  // Ensure it is transparent when re-added to the DOM.
        .appendTo('body')
        .animate({'opacity': 1}, 750);  // $.animate needs to be used here - $.transit refused to animate.
};

Spotlight.prototype.off = function () {
    // Fadeout the svg node and then detach
    this.$el.stop(false, false).transition({'opacity': 0}, 250, this.$el.detach);
};
