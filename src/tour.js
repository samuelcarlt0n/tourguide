// Index to start the tour at.
var FIRST_STOP = 0;


// Object representing a tour.
var Tour = function (stops, firstStop) {
    if (!stops) {
        throw new Error("You can't schedule a tour without any stops.");
    }
    if (!stops instanceof Array) {
        throw new Error("The schedule should be an Array.");
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
    this.transitionToStop(this.currentStop);

    this.tourIsStarted = true;

    return this;
};

// Update each stop's position data on the tour.
// Call this after a window.resize event
Tour.prototype.updateSchedule = function () {
    this.transitionToStop(this.currentStop);
};

// Jump to any stop on the tour.
Tour.prototype.transitionToStop = function (stopIndex) {
    var stop = this.stops[stopIndex];
    var plaque = this.plaque;

    plaque.close();

    var offset = stop.getOffset();
    var dimensions = stop.getDimensions();
    var scrollPos = stop.getScrollPosition();

    $.when(
        this._scrollToStop(scrollPos),
        this.spotlight.move(offset, dimensions)
    ).done(function () {
        plaque.open(
            offset, dimensions, stop.info, stopIndex + 1
        );
    });
};

// Convenience method.
// Move to the next stop on the tour.
Tour.prototype.nextStop = function () {
    if (this.currentStop === (this.stops.length - 1)) { return; }  // If there is no next stop.

    this.currentStop = this.currentStop + 1;
    this.transitionToStop(this.currentStop);
};

// Convenience method.
// Move to the previous stop on the tour.
Tour.prototype.previousStop = function () {
    if (this.currentStop === 0) { return; }  // If there is no previous stop.

    this.currentStop = this.currentStop - 1;
    this.transitionToStop(this.currentStop);
};

Tour.prototype.resume = function () {
    if (this.tourIsStarted) { return this; }
    this.updateSchedule();
    this.spotlight.on();
    this.tourIsStarted = true;
};

Tour.prototype.cancel = function () {
    if (!this.tourIsStarted) { return this; }
    this.spotlight.off();
    this.plaque.close();
    this.tourIsStarted = false;
};

Tour.prototype._scrollToStop = function (scrollPosition) {
    var d = $.Deferred();
    $('html, body').stop(false, false).animate({'scrollTop': scrollPosition}, 250, d.resolve);
    return d.promise();
};


