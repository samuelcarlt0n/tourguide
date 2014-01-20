var MINIMUM_SCALE = 1.5;
var ANIMATION_DURATION = 600;

var PINHOLE_PATH = 'M0,0v2000h2000V0H0z ' +  // Extra space is intentional
                   'M1000,1025c-13.807,0-25-11.193-25-25s11.193-25,25-25s25,11.193,25,25S1013.807,1025,1000,1025z';


// Object representing a spotlight for the tour.
// Constructor
var Spotlight = function () {
    this.snap = Snap(2000, 2000).attr({
        'id': 'spotlight',
        'class': 'spotlight'
    });
    this.$el = $(this.snap.node);

    // this.filterBlur = this.snap.paper.filter('<feGaussianBlur stdDeviation="2"/>');
    // For the filter effect apply to pinHole -> `filter: this.filterBlur`
    this.pinHole = this.snap.path(PINHOLE_PATH).attr({
        'fill': '#111111',
        'fill-opacity': '0.6'
    });
};

Spotlight.prototype.move = function (center, size) {
    var d = $.Deferred();

    this._zoom(size);
    this.$el
        .stop(false, false)
        .transition({
            'top': center.top - (this.$el.height() / 2),
            'left': center.left - (this.$el.width() / 2)
        }, ANIMATION_DURATION, 'linear', d.resolve);

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
    this.$el.transit({'opacity': 0}, 250, 'snap', this.$el.detach);
};

Spotlight.prototype._zoom = function (size) {
    var scale = Math.max(size.width, size.height) * (0.025);
    scale = scale < MINIMUM_SCALE ? MINIMUM_SCALE : scale;
    this.$el.transition({'scale': scale}, ANIMATION_DURATION, 'snap');
};
