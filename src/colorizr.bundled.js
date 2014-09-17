(function (window, undefined) {
    'use strict';

    function loadJQuery() {
        // jquery.js start
${ jQuery }
        // jquery.js end
    }

    function loadSpectrum() {
        window.jQuery('head').append('<style type="text/css">${ spectrum.css }</style>');
        // spectrum.js start
${ spectrum.js }
        // spectrum.js end
    }

    function loadColorizr() {
        // colorizr.js start
${ colorizr }
        // colorizr.js end
    }

    if (window.jQuery === undefined) {
        loadJQuery();
    }

    if (window.jQuery.fn.spectrum === undefined) {
        loadSpectrum();
    }

    if (window.jQuery('#colorizr').length === 0) {
        loadColorizr();
    }

})(window);
