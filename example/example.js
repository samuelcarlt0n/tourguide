$(document).ready(function () {
    'use strict';

    // Fixture data.
    var STOPS = window.STOPS = [{
        selector : '#stop1',
        headline : "My Account",
        message  : "Bacon ipsum dolor sit amet tongue pancetta chuck boudin turducken swine. Shankle tail spare ribs bacon sirloin, ribeye boudin pig ball tip pork loin andouille leberkas tri-tip ham hock pork."
    }, {
        selector : '#stop2',
        headline : "Top Headlines",
        message  : "Beef ribs capicola turducken frankfurter boudin, pastrami bresaola prosciutto pig sausage."
    }, {
        selector : '#stop3',
        headline : "Jump to a Category",
        message  : "Salvia four loko XOXO, Intelligentsia lo-fi keffiyeh skateboard polaroid."
    }, {
        selector : '#stop4',
        headline : "osidhfosdihfosdihofsih.",
        message  : "amber, microbrewery abbey hydrometer, brewpub ale lauter tun saccharification oxidized barrel. berliner weisse wort chiller adjunct hydrometer alcohol aau!"
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



    window.website = new Website();
});
