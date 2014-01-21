// Index to start the tour at.
var FIRST_STOP = 0;


// Object representing a tour.
var Tour = function (stops, firstStop) {
    if (!stops)                  { throw new Error("You can't schedule a tour without any stops."); }
    if (!stops instanceof Array) { throw new Error("The schedule should be an Array."); }

    firstStop = firstStop || FIRST_STOP;
    this.schedule(stops).start(firstStop);
};

// This essentially acts a builder for tours.
Tour.prototype.schedule = function (stops) {
    this.currentStopIndex = null;

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
    this.currentStopIndex = firstStop;
    this.transitionToStop(this.currentStopIndex);

    this.tourIsStarted = true;

    return this;
};

// Update each stop's position data on the tour.
// Call this after a window.resize event
Tour.prototype.updateSchedule = function () {
    this.transitionToStop(this.currentStopIndex);
};

// Convenience method.
// Move to the next stop on the tour.
Tour.prototype.nextStop = function () {
    if (this.currentStopIndex === (this.stops.length - 1)) { return; }  // If there is no next stop.

    this.currentStopIndex++;
    this.transitionToStop(this.currentStopIndex);
};

// Convenience method.
// Move to the previous stop on the tour.
Tour.prototype.previousStop = function () {
    if (this.currentStopIndex === 0) { return; }  // If there is no previous stop.

    this.currentStopIndex--;
    this.transitionToStop(this.currentStopIndex);
};

Tour.prototype.resume = function () {
    if (this.tourIsStarted) { return this; }
    this.updateSchedule();
    this.spotlight.on();
    this.transitionToStop(this.currentStopIndex);
    this.tourIsStarted = true;
};

Tour.prototype.cancel = function () {
    if (!this.tourIsStarted) { return this; }
    this.spotlight.off();
    this.plaque.close();
    this.tourIsStarted = false;
};

// Jump to any stop on the tour.
Tour.prototype.transitionToStop = function (stopIndex) {
    this._teardownStopSetup();

    var stop = this.stops[stopIndex];
    var plaque = this.plaque;

    plaque.close();

    if (stop.setup) { this._setupStop(stop.setup); }

    var offset = stop.getOffset();
    var dimensions = stop.getDimensions();
    var scrollPos = stop.getScrollPosition();

    $.when(
        this.spotlight.move(offset, dimensions),
        this._scrollToStop(scrollPos)
    ).done(function () {
        plaque.open(offset, dimensions, stop.info, stopIndex + 1);
    });

    this.stop = stop;
};


Tour.prototype._scrollToStop = function (scrollPosition) {
    var d = $.Deferred();
    $('html, body').stop(false, false).animate({'scrollTop': scrollPosition}, 250, d.resolve);
    return d.promise();
};

Tour.prototype._setupStop = function (setup) {
    if (setup.setupEvent) {
        setup.$el.trigger(setup.setupEvent);
    }
    if (setup.setupClass) {
        setup.$el.addClass(setup.setupClass);
    }
};

Tour.prototype._teardownStopSetup = function () {
    var stop = this.stop;
    if (!stop) { return; }

    var setup = stop.setup;
    if (!setup) { return; }

    if (setup.setupEvent) { setup.$el.trigger(setup.setupEvent); }
    if (setup.setupClass) { setup.$el.removeClass(setup.setupClass); }
};
