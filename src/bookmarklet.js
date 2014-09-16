// Paste this code into e.g. http://ted.mielczarek.org/code/mozilla/bookmarklet.html

function loadScript(url) {
    var s = document.createElement('script');
    s.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(s);
}

function loadCss(url) {
    var r = document.createElement('link');
    r.setAttribute('rel', 'stylesheet');
    r.setAttribute('type', 'text/css');
    r.setAttribute('href', url);
    document.getElementsByTagName('head')[0].appendChild(r);
}

function loadJQuery() {
    loadScript('//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
}

function loadSpectrum() {
    loadCss('//cdn.jsdelivr.net/jquery.spectrum/1.3.3/spectrum.css');
    loadScript('//cdn.jsdelivr.net/jquery.spectrum/1.3.3/spectrum.min.js');
}

function loadColorizr() {
    loadScript('//raw.githubusercontent.com/analog-nico/colorizr/master/src/colorizr.js');
}

if (window.jQuery === undefined) {
    loadJQuery();
    loadSpectrum();
    loadColorizr();
} else if (window.jQuery.fn.spectrum === undefined) {
    loadSpectrum();
    loadColorizr();
} else if (window.jQuery('#colorizr').length === 0) {
    loadColorizr();
}
