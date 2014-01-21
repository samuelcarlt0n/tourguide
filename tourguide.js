(function (window) {
    'use strict';

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }

var MAX_DISTANCE = 50;


var PLAQUE_TEMPLATE =
    '<div class="plaque">' +
        '<div class="plaque-bd">' +
            '<div class="plaque-steps">' +
                '<span class="plaque-stopNumber js-plaque-stopNumber"></span> of ' +
                '<span class="plaque-totalStops js-plaque-totalStops"></span>' +
            '</div>' +
            '<div class="plaque-title js-plaque-title"></div>' +
            '<div class="plaque-message js-plaque-message"></div>' +
        '</div>' +
        '<div class="plaque-ft">' +
            '<div class="plaque-ft-controls">' +
                '<span class="js-tourGuide-previous">&larr; prev</span>' +
                '<span class="js-tourGuide-next">next &rarr; </span>' +
            '</div>' +
        '</div>' +
    '</div>'
;

var Plaque = function (totalStops) {
    this.$el = $(PLAQUE_TEMPLATE).appendTo('body');
    this.$headline = this.$el.find('.js-plaque-title');
    this.$message = this.$el.find('.js-plaque-message');
    this.$stopNumber = this.$el.find('.js-plaque-stopNumber');
    this.$totalStops = this.$el.find('.js-plaque-totalStops').text(totalStops);
    this.arrowClass = '';  // This class will be applied to the element for the css pointer arrow.
};

Plaque.prototype.open = function (offset, size, info, stopNumber) {
    // Call update first so the element is resized with new content before gettings it's size checked.
    this._updateContent(info, stopNumber);

    var plaqueHeight = this.$el.outerHeight();
    var plaqueWidth = this.$el.outerWidth();

    var top, left, arrowClass;



    if (offset.top + size.height + plaqueHeight < $(window).height()) {
        top = (offset.top + size.height) + (plaqueHeight * 1.08  < MAX_DISTANCE ? plaqueHeight * 1.08 : MAX_DISTANCE);
        left = (offset.left + (size.width / 2)) - (plaqueWidth / 2);
        arrowClass = 'plaque_below';
    }

    if ($(window).width() - (offset.left + size.width) > plaqueWidth) {
        top = (offset.top + (size.height / 2)) - (plaqueHeight / 2);
        left = (offset.left + size.width) * 1.08;
        arrowClass = 'plaque_right';
    }

    if (offset.top > plaqueHeight) {
        top = (offset.top - plaqueHeight) - (plaqueHeight * 1.08  < MAX_DISTANCE ? plaqueHeight * 1.08 : MAX_DISTANCE);
        left = (offset.left + (size.width / 2)) - (plaqueWidth / 2);
        arrowClass = 'plaque_above';
    }

    if (offset.left > plaqueWidth) {
        top = (offset.top + (size.height / 2)) - (plaqueHeight / 2);
        left = offset.left - (plaqueWidth * 1.08);
        arrowClass = 'plaque_left';
    }

    this.$el
        .stop(false, false)
        .css({
            top  : top,
            left : left
        })
        .removeClass(this.arrowClass)
        .addClass(arrowClass)
        .fadeIn(20);

    this.arrowClass = arrowClass;

    return this;
};

Plaque.prototype.close = function () {
    this.$el.stop(false, false).hide();
    return this;
};

Plaque.prototype._updateContent = function (info, stopNumber) {
    this.$headline.text(info.headline);
    this.$message.text(info.message);
    this.$stopNumber.text(stopNumber);

    return this;
};

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

// Object representing a single stop on the tour.
var Stop = function (stopData) {
    this.$el = $(stopData.selector);

   if (this.$el.length !== 1) {
        var errorMessage = "The stop {headline} - {message} is not present in the DOM, or more than one node was found.";
        throw new Error(errorMessage.replace('{headline}', this.headline).replace('{message}', this.message));
    }

    if (stopData.setup) {
        this.setup = {};
        this.setup.$el = $(stopData.setup.selector);
        this.setup.setupEvent = stopData.setup.event;
        this.setup.setupClass = stopData.setup.class;
    }

    this.info = {
        headline: stopData.headline || '',
        message: stopData.message || ''
    };
};

Stop.prototype.getOffset = function () {
    var stopOffset = this.$el.offset();
    return {
        top: parseInt(stopOffset.top, 10),
        left: parseInt(stopOffset.left, 10)
    };
};

Stop.prototype.getDimensions = function () {
    return {
        width: parseInt(this.$el.width(), 10),
        height: parseInt(this.$el.height(), 10)
    };
};

Stop.prototype.getScrollPosition = function () {
   return parseInt(this.$el.offset().top - ($(window).innerHeight() / 2), 10);
};

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

    if ( typeof module === 'object' && module && typeof module.exports === 'object' ) {
        module.exports = TourGuide;
    } else {
        if ( typeof define === 'function' && define.amd ) {
            define( 'tourguide', [], function () { return tourguide; } );
        }
    }

    if ( typeof window === 'object' && typeof window.document === 'object' ) {
        window.TourGuide = Tour;
    }
})(window);
