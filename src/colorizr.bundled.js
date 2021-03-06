(function (window, undefined) {
    'use strict';

    function loadJQuery() {
        // jquery.js start
/*:= jQuery :*/
        // jquery.js end
    }

    function loadSpectrum() {
        window.jQuery('head').append('<style type="text/css">/*:= spectrum.css :*/</style>');
        // spectrum.js start
/*!
 * Spectrum Colorpicker v1.5.1
 * https://github.com/bgrins/spectrum
 * Author: Brian Grinstead
 * License: MIT
 */
/*:= spectrum.js :*/
        // spectrum.js end
    }

    function loadColorizr() {
        // colorizr.js start
/*:= colorizr :*/
        // colorizr.js end
    }

    var jQueryAlreadyPresent = window.jQuery !== undefined;

    loadJQuery();
    loadSpectrum();

    if (window.jQuery('#colorizr').length === 0) {
        loadColorizr();
    }

    if (jQueryAlreadyPresent) {
        window.jQuery.noConflict(true); // Restore previous jQuery instance
    }

})(window);
