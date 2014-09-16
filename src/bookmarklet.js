(function() {

    function loadJQuery() {
        var s = document.createElement('script');
        s.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
        document.getElementsByTagName('head')[0].appendChild(s);
    }

    function loadSpectrum() {
        var r = document.createElement('link');
        r.setAttribute('rel', 'stylesheet');
        r.setAttribute('type', 'text/css');
        r.setAttribute('href', 'http://raw.githubusercontent.com/bgrins/spectrum/master/spectrum.css');
        document.getElementsByTagName('head')[0].appendChild(r);
        var s = document.createElement('script');
        s.setAttribute('src','http://raw.githubusercontent.com/bgrins/spectrum/master/spectrum.js');
        document.getElementsByTagName('head')[0].appendChild(s);
    }

    function loadColorizr() {
        var s = document.createElement('script');
        s.setAttribute('src','http://raw.githubusercontent.com/analog-nico/colorizr/master/src/index.js');
        document.getElementsByTagName('head')[0].appendChild(s);
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

}());