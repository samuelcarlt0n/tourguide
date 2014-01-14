var PINHOLE_PATH = 'M0,0v2000h2000V0H0z ' +  // Extra space is intentional
                   'M1000,1025c-13.807,0-25-11.193-25-25s11.193-25,25-25s25,11.193,25,25S1013.807,1025,1000,1025z';


// Object representing a spotlight for the tour.
var Spotlight = function () {
    this.snap = window.Snap(2000, 2000).attr({
        'id': 'spotlight',
        'class': 'spotlight'
    });
    this.$el = $(this.snap.node);

    /*
        this.filterBlur = this.snap.paper.filter('<feGaussianBlur stdDeviation="2"/>');
        For the filter effect apply to pinHole -> `filter: this.filterBlur`
     */
    this.pinHole = this.snap.path(PINHOLE_PATH).attr({
        'fill': '#222222',
        'fill-opacity': '0.85'
    });
};

Spotlight.prototype.move = function (center, size) {
    var d = $.Deferred();

    this.$el
        .stop(false, false)
        .animate({
            'top': center.top - (this.$el.height() / 2),
            'left': center.left - (this.$el.width() / 2)
        }, 300, 'swing', d.resolve);
    this._zoom(size);

    return d.promise();
};

// Should not be called directly.
Spotlight.prototype._zoom = function (size) {
    this.$el.css({
        '-webkit-transform': 'scale(' + (Math.max(size.width, size.height) * (0.033)) + ')'
    });
};
