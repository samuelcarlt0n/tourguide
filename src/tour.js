// Index to start the tour at.
var FIRST_STOP = 0;


// Object representing a tour.
var Tour = function (stops, firstStop) {
    if (!stops) {
        throw new Error("You can't schedule a tour without any stops.");
    }
    firstStop = firstStop || FIRST_STOP;

    this.schedule(stops).start(firstStop);
};

// This essentially acts a builder for tours.
Tour.prototype.schedule = function (stops) {
    this.currentStop = null;

    var _stops = [];
    stops.forEach(function (stop) {
        if (!stop.selector.startsWith('#')) throw new Error("The stop selector must be an id.");
        _stops.push(new Stop(stop));
    });
    this.stops = _stops;

    this.plaque = new Plaque(this.stops.length);
    this.spotlight = new Spotlight();

    return this;
};

// Start the tour.
Tour.prototype.start = function (firstStop) {
    this.currentStop = firstStop;
    this.jumpToStop(this.currentStop);

    return this;
};

// Jump to any stop on the tour.
Tour.prototype.jumpToStop = function (stopIndex) {
    var stop = this.stops[stopIndex];
    var plaque = this.plaque;

    plaque.close();
    this.spotlight.move(
        stop.centerOf$el,
        stop.sizeOf$el
    ).then(function () {
        plaque.open(
            stop.positionOf$el, stop.centerOf$el, stop.sizeOf$el,
            stop.headline, stop.message, stopIndex + 1
        );
    });
};

// Convenience method.
// Move to the next stop on the tour.
Tour.prototype.nextStop = function () {
    if (this.currentStop === (this.stops.length - 1)) return;  // If there is no next stop.

    this.currentStop = this.currentStop + 1;
    this.jumpToStop(this.currentStop);
};

// Convenience method.
// Move to the previous stop on the tour.
Tour.prototype.previousStop = function () {
    if (this.currentStop === 0) return;  // If there is no previous stop.

    this.currentStop = this.currentStop - 1;
    this.jumpToStop(this.currentStop);
};
