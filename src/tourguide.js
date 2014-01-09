$(document).ready(function () {

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }


    var FIRST_STOP = 0;  // Index to start the tour at.

    var LEFT_KEY  = 37;  // Key code for left key.
    var RIGHT_KEY = 39;  // Key code for right key.

    // Fixture data.
    var STOPS = [{
        id       : '#one',
        headline : "Stop one",
        message  : "A lot more stuf describing this stop."
    }, {
        id       : '#two',
        headline : "Stop Two",
        message  : "Some text describing this stop."
    }, {
        id       : '#three',
        headline : "Stop Three",
        message  : "I need to install little ipsum describing this stop."
    }];


    // Object representing a spotlight for the tour.
    var Spotlight = function () {
        this.$el = $(document.createElement('div')).attr({
            'id': 'spotlight',
            'class': 'spotlight'
        }).appendTo('body');

        this.move = function (top, left, radius) {
            this.$el.stop(false, false).animate({
                'top' : top,
                'left' : left,
                'width' : radius,
                'height' : radius
            });
        };
    };


    // Object representing a single stop on the tour.
    var Stop = function (stopData) {
        this.headline      = stopData.headline || '';          // Main text.
        this.message       = stopData.message || '';           // Supporting copy.
        this.$el           = $(stopData.id);                   // jQuery instance of the dom node.
        this.positionOf$el = this.$el.offset();                // {top, left} of the $el.
        this.sizeOf$el     = {width  : this.$el.outerWidth(),  // {width, height} of the $el.
                              height : this.$el.outerHeight()};
    };


    // Object representing a tour.
    var Tour = function (stops, firstStop) {
        stops = stops || STOPS;
        firstStop = firstStop || FIRST_STOP;

        if (stops.length) {
            this.schedule(stops).start(firstStop);
        }
    };

    Tour.prototype = {
        // This essentially acts a builder function for tours.
        schedule: function (stops) {
            this.currentStop = null;
            this.spotlight = null;

            var _stops = [];
            stops.forEach(function (stop) {
                if (!stop.id.startsWith('#')) throw new Error("The selector must be an id.");
                _stops.push(new Stop(stop));
            });
            this.stops = stops;

            return this;
        },

        // Start the tour.
        start: function (firstStop) {
            this.spotlight = new Spotlight();
            this.currentStop = firstStop;
            this.jumpToStop(this.currentStop);
        },

        // Move to the next stop on the tour.
        nextStop: function () {
            if (this.currentStop === this.stops.length - 1) return;  // If there is no next stop.

            this.currentStop = this.currentStop + 1;
            this.jumpToStop(this.currentStop);
        },

        // Move to the previous stop on the tour.
        previousStop: function () {
            if (this.currentStop - 1 === -1) return;  // If there is no previous stop.

            this.currentStop = this.currentStop - 1;
            this.jumpToStop(this.currentStop);
        },

        // Jump to any stop on the tour.
        jumpToStop: function (stopIndex) {
            var stop = this.stops[stopIndex];
            this.spotlight.move(
               stop.positionOf$el.top,
               stop.positionOf$el.left,
               (Math.max(stop.sizeOf$el.w, stop.sizeOf$el.h) * 1.33)
            );
       },
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
            event.preventDefault();
            if (event.keyCode === LEFT_KEY) this.tour.previousStop();
            if (event.keyCode === RIGHT_KEY) this.tour.nextStop();
        };

        this.bind().enable();
    };


    // Randomly place all of the test stops on the page.
    (function shuffleTestStops () {
        $('.obj').each(function () {
            this.style.top = (Math.floor(Math.random() * 100) + 1) + '%';
            this.style.left = (Math.floor(Math.random() * 100) + 1) + '%';
        });
    })();


    window.tourGuide = new TourGuide();
});
