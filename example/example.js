$(document).ready(function () {
    'use strict';

    // Fixture data.
    var STOPS = [{
        selector : '#one',
        headline : "Stop one",
        message  : "A lot more stuf describing this stop."
    }, {
        selector : '#two',
        headline : "Stop Two",
        message  : "Some text describing this stop."
    }, {
        selector : '#three',
        headline : "Stop Three",
        message  : "I need to install little ipsum describing this stop."
    }, {
        selector : '#four',
        headline : "Stop four",
        message  : "I need to install little ipsum describing this stop."
    }, {
        selector : '#five',
        headline : "Stop five",
        message  : "I need to install little ipsum describing this stop."
    }, {
        selector : '#six',
        headline : "Stop six",
        message  : "I need to install little ipsum describing this stop."
    }];


    var LEFT_KEY  = 37;  // Key `which` for left key.
    var RIGHT_KEY = 39;  // Key `which` for right key.


    var Website = function () {
        this.tourGuide = new TourGuide(STOPS);
        this.bind().enable();
    };

    Website.prototype.bind = function () {
        this.onKeyUpHandler = this.onKeyUp.bind(this);
        this.moveToPreviousHandler = this.moveToPrevious.bind(this);
        this.moveToNextHandler = this.moveToNext.bind(this);
        return this;
    };

    Website.prototype.enable = function () {
        $(document).on('keyup', this.onKeyUpHandler);
        $(document.body).on('click', '.js-tourGuide-next', this.moveToNextHandler);
        $(document.body).on('click', '.js-tourGuide-previous', this.moveToPreviousHandler);

        return this;
    };

    Website.prototype.onKeyUp = function (event) {
        if (event.which === LEFT_KEY) this.moveToPreviousHandler(event);
        if (event.which === RIGHT_KEY) this.moveToNextHandler(event);
    };

    Website.prototype.moveToPrevious = function (event) {
        event.preventDefault();
        this.tourGuide.previousStop();
    };

    Website.prototype.moveToNext = function (event) {
        event.preventDefault();
        this.tourGuide.nextStop();
    };


    // Randomly place all of the test stops on the page.
    (function shuffleTestStops () {
        $('.obj').each(function () {
            this.style.top = (Math.floor(Math.random() * 100) + 1) + '%';
            this.style.left = (Math.floor(Math.random() * 100) + 1) + '%';
            var minSize = 50;
            var w = (Math.floor(Math.random() * 100) * 2);
            var h = (Math.floor(Math.random() * 100) * 2);
            this.style.width = w > minSize ? w : minSize + 'px';
            this.style.height = h > minSize ? h : minSize + 'px';
        });
    })();

    window.website = new Website();
});
