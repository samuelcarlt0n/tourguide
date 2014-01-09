$(document).ready(function () {

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }

    var FIRST_STOP = 0;  // Index to start the tour at.

    var LEFT_KEY  = 37;  // Key code for left key.
    var RIGHT_KEY = 39;  // Key code for right key.

    var STOPS = [{
        selector : '#one',
        headline : 'Stop one',
        message  : 'A lot more stuf describing this stop.'
    }, {
        selector : '#two',
        headline : 'Stop Two',
        message  : 'Some text describing this stop.'
    }, {
        selector : '#three',
        headline : 'Stop Three',
        message  : 'I need to install little ipsum describing this stop.'
    }];


    var Stop = function (stopData) {
        this.$el        = $(stopData.selector);
        this.headline   = stopData.headline;
        this.message    = stopData.message;
        this.dimensions = {width: this.$el.outerWidth(), height: this.$el.outerHeight()};
        this.position   = this.$el.offset();
    };


    var Tour = function (stops, firstStop) {
        stops = stops || STOPS;
        firstStop = firstStop || FIRST_STOP;

        if (stops.length) {
            this.schedule(stops);
            this.start(firstStop);
        }
    };

    Tour.prototype = {
        stops: [],
        currentStop: null,
        $spotlight: null,

        schedule: function (stops) {
            stops.forEach(function (stop) {
                if (!stop.selector.startsWith('#')) {
                    throw new Error("The selector must be an id");
                }
                this.stops.push(
                    new Stop(stop)
                );
            }, this);
        },

        start: function (firstStop) {
            this.$spotlight = $(document.createElement('div')).attr({
                'id': 'spotlight',
                'class': 'spotlight'
            }).appendTo('body');

            this.currentStop = firstStop;
            this.jumpToStop(this.currentStop);
        },

        nextStop: function () {
            if (this.currentStop + 1 > this.stops.length - 1) {
                return;
            }

            this.currentStop = this.currentStop + 1;
            this.jumpToStop(this.currentStop);
        },

        previousStop: function () {
            if (this.currentStop - 1 === -1) {
                return;
            }

            this.currentStop = this.currentStop - 1;
            this.jumpToStop(this.currentStop);
        },

        jumpToStop: function (stopsIndex) {
            var stop = this.stops[stopsIndex];
            this._movespotlight(stop);
        },

        _movespotlight: function (stop) {
            var w = stop.dimensions.width, h = stop.dimensions.height;
            var t = stop.position.top,     l = stop.position.left;

            var size = Math.max(w, h) * (1.33);

            this.$spotlight.stop(false, false).animate({
                'top': t,
                'left': l,
                'width': size,
                'height': size
            });
        }
    };


    var TourGuide = function () {
        this.tour = new Tour();

        this.bind = function () {
            this.onKeyUpHandler = this.onKeyUp.bind(this);
            return this;
        };

        this.enable = function () {
            $(document).on('keyup', this.onKeyUpHandler);
            return this;
        };

        this.onKeyUp = function (event) {
            if (event.keyCode === LEFT_KEY) this.tour.previousStop();
            if (event.keyCode === RIGHT_KEY) this.tour.nextStop();
        };

        this.bind().enable();
    };


    window.tourGuide = new TourGuide();
});
