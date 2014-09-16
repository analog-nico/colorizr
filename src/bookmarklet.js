// Paste this code into e.g. http://ted.mielczarek.org/code/mozilla/bookmarklet.html

var head = document.getElementsByTagName('head')[0];

function loadJQuery() {
    var s = document.createElement('script');
    s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
    head.appendChild(s);
}

function loadSpectrum() {
    var r = document.createElement('link');
    r.setAttribute('rel', 'stylesheet');
    r.setAttribute('type', 'text/css');
    r.setAttribute('href', 'https://raw.githubusercontent.com/bgrins/spectrum/master/spectrum.css');
    head.appendChild(r);
    var s = document.createElement('script');
    s.setAttribute('src','https://raw.githubusercontent.com/bgrins/spectrum/master/spectrum.js');
    head.appendChild(s);
}

function loadColorizr() {
    var s = document.createElement('script');
    s.setAttribute('src','https://raw.githubusercontent.com/analog-nico/colorizr/master/src/colorizr.js');
    head.appendChild(s);
}

if (window.jQuery === undefined) {
    loadJQuery();
    loadSpectrum();
    loadColorizr();
} else if (window.jQuery.fn.spectrum === undefined) {
    loadSpectrum();
    loadColorizr();
} else if (window.jQuery('.colorizr').length === 0) {
    loadColorizr();
}
