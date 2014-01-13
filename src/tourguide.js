$(document).ready(function () {

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }



    var PINHOLE_PATH = 'M0,0v2000h2000V0H0z ' +  // Extra space is intentional
                       'M1000,1025c-13.807,0-25-11.193-25-25s11.193-25,25-25s25,11.193,25,25S1013.807,1025,1000,1025z';

    // Index to start the tour at.
    var FIRST_STOP = 0;

    // Key `which` for left key.
    var LEFT_KEY  = 37;
    // Key `which` for right key.
    var RIGHT_KEY = 39;

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
        this.snap = Snap(2000, 2000).attr({
            'id': 'spotlight',
            'class': 'spotlight'
        });
        this.$el = $(this.snap.node);
        // this.filterBlur = this.snap.paper.filter('<feGaussianBlur stdDeviation="2"/>');
        this.pinHole = this.snap.path(PINHOLE_PATH).attr({
            'fill': "#222222",
            fillOpacity: "0.75",
            /* filter: this.filterBlur */
        });
    };

    Spotlight.prototype.move = function(top, left, radius) {
        this.$el.stop(false, false).animate({
            'top': top - (this.$el.height() / 2),
            'left': left - (this.$el.width() / 2)
        });
    };



    // Object representing a single stop on the tour.
    var Stop = function (stopData) {
        // Main text.
        this.headline = stopData.headline || '';
        // Supporting copy.
        this.message = stopData.message || '';

        this.$el = $(stopData.id);

        // {width, height} of the $el including borders.
        this.sizeOf$el = { width: this.$el.outerWidth(), height: this.$el.outerHeight() };
        // {top, left} of the $el relative to the document.
        this.positionOf$el = this.$el.offset();
        // {top, left} center point of the $el relative to the document.
        this.centerOf$el = {
            top: (this.sizeOf$el.height / 2) + this.positionOf$el.top,
            left: (this.sizeOf$el.width / 2) + this.positionOf$el.left
        };
    };



    // Object representing a tour.
    var Tour = function (stops, firstStop) {
        stops = stops || STOPS;
        firstStop = firstStop || FIRST_STOP;

        this.schedule(stops).start(firstStop);
    };

    // This essentially acts a builder function for tours.
    Tour.prototype.schedule = function (stops) {
        this.currentStop = null;
        this.spotlight = null;

        var _stops = [];
        stops.forEach(function (stop) {
            if (!stop.id.startsWith('#')) throw new Error("The selector must be an id.");
            _stops.push(new Stop(stop));
        });
        this.stops = _stops;

        return this;
    };

    // Start the tour.
    Tour.prototype.start = function (firstStop) {
        this.spotlight = new Spotlight();
        this.currentStop = firstStop;
        this.jumpToStop(this.currentStop);

        return this;
    };

    // Move to the next stop on the tour.
    Tour.prototype.nextStop = function () {
        if (this.currentStop === this.stops.length - 1) return;  // If there is no next stop.

        this.currentStop = this.currentStop + 1;
        this.jumpToStop(this.currentStop);
    };

    // Move to the previous stop on the tour.
    Tour.prototype.previousStop = function () {
        if (this.currentStop - 1 === -1) return;  // If there is no previous stop.

        this.currentStop = this.currentStop - 1;
        this.jumpToStop(this.currentStop);
    };

    // Jump to any stop on the tour.
    Tour.prototype.jumpToStop = function (stopIndex) {
        var stop = this.stops[stopIndex];
        this.spotlight.move(
           stop.centerOf$el.top,
           stop.centerOf$el.left,
           (Math.max(stop.sizeOf$el.width, stop.sizeOf$el.height) * 1.33)
        );
    };



    var TourGuide = function () {
        this.tour = new Tour();
        this.bind().enable();
    };

    TourGuide.prototype.bind = function () {
        this.onKeyUpHandler = this.onKeyUp.bind(this);
        return this;
    };

    TourGuide.prototype.enable = function () {
        $(document).on('keyup', this.onKeyUpHandler);
        return this;
    };

    TourGuide.prototype.onKeyUp = function (event) {
        event.preventDefault();
        if (event.which === LEFT_KEY) this.tour.previousStop();
        if (event.which === RIGHT_KEY) this.tour.nextStop();
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
