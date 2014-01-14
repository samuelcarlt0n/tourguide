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
