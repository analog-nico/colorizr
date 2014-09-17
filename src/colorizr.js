(function ($) {
    'use strict';

    if ($ === undefined) {
        alert('To use colorizr.js please load jQuery first.');
        return;
    } else if ($.fn.spectrum === undefined) {
        alert('To use colorizr.js please load Spectrum (the color picker) first.');
        return;
    }

    $('head').append('<style type="text/css">' +
            '#colorizr.clrz-reset, #colorizr .clrz-reset {' +
                'animation: none !important;' +
                '-webkit-appearance: none !important;' +
                '-moz-appearance:    none !important;' +
                'appearance:         none !important;' +
                'background-color: transparent !important;' +
                'background-image: none !important;' +
                'border: 0 !important;' +
                'bottom: auto !important;' +
                'box-shadow: none !important;' +
                'box-sizing: border-box !important;' +
                'clear: none !important;' +
                'color: #333333 !important;' +
                'columns: auto auto !important;' +
                'content: normal !important;' +
                'cursor: auto !important;' +
                'direction: ltr !important;' +
                'display: inline !important;' +
                'filter: none !important;' +
                'float: none !important;' +
                'font: normal normal normal normal 16px/1.4  !important;' +
                'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important;' +
                'font-size: 16px !important;' +
                'font-stretch: normal !important;' +
                'font-style: normal !important;' +
                'font-variant: normal !important;' +
                'font-weight: normal !important;' +
                'hanging-punctuation: none !important;' +
                'height: auto !important;' +
                'hyphens: none !important;' +
                'left: auto !important;' +
                'letter-spacing: normal !important;' +
                'line-height: normal !important;' +
                'list-style: disc outside none !important;' +
                'margin: 0 !important;' +
                'max-height: none !important;' +
                'max-width: none !important;' +
                'min-height: 0 !important;' +
                'min-width: 0 !important;' +
                'opacity: 1 !important;' +
                'orphans: 2 !important;' +
                'outline: none !important;' +
                'overflow: visible !important;' +
                'overflow-x: visible !important;' +
                'overflow-y: visible !important;' +
                'padding: 0 !important;' +
                'perspective: none !important;' +
                'pointer-events: auto !important;' +
                'position: static !important;' +
                'right: auto !important;' +
                'tab-size: 8 !important;' +
                'table-layout: auto !important;' +
                'text-align: left !important;' +
                'text-align-last: auto !important;' +
                'text-decoration: none !important;' +
                'text-indent: 0 !important;' +
                'text-overflow: clip !important;' +
                'text-shadow: none !important;' +
                'text-transform: none !important;' +
                'top: auto !important;' +
                'transform: none !important;' +
                'vertical-align: baseline !important;' +
                'visibility: visible !important;' +
                'white-space: normal !important;' +
                'widows: 0 !important;' +
                'width: auto !important;' +
                'word-break: normal !important;' +
                'word-spacing: normal !important;' +
                'z-index: auto !important;' +
                'zoom: 1 !important;' +
            '}' +
            '#colorizr div.clrz-reset {' +
                'display: inline-block !important;' +
            '}' +
            '#colorizr.clrz-panel {' +
                'width: 100% !important;' +
                'height: 210px !important;' +
                'position: fixed !important;' +
                'bottom: 0 !important;' +
                'left: 0 !important;' +
                'right: 0 !important;' +
                'z-index: 9999 !important;' +
                'background-color: white !important;' +
                '-webkit-box-shadow: 0 0 6px -6px black !important;' +
                '-moz-box-shadow: 0 0 6px 0 black !important;' +
                'box-shadow: 0 0 6px 0 black !important;' +
                'padding: 30px !important;' +
            '}' +
            '#colorizr .clrz-header, #colorizr .clrz-rule {' +
                'min-height: 30px !important;' +
            '}' +
            '#colorizr .clrz-header {' +
                'width: 100% !important;' +
                'border-bottom: 1px solid #aaa !important;' +
            '}' +
            '#colorizr .clrz-rule-container {' +
                'height: 135px !important;' +
                'width: 100% !important;' +
                'position: relative !important;' +
            '}' +
            '#colorizr .clrz-rule-container-scroller {' +
                'overflow-y: scroll !important;' +
                'position: absolute !important;' +
                'top: 0 !important;' +
                'bottom: 0 !important;' +
                'left: 0 !important;' +
                'right: 0 !important;' +
                'padding-bottom: 20px !important;' +
            '}' +
            '#colorizr .clrz-shadow {' +
                'box-shadow: inset 0 -20px 10px -10px white !important;' +
                'position: absolute !important;' +
                'height: 20px !important;' +
                'bottom: 0 !important;' +
                'left: 0 !important;' +
                'right: 0 !important;' +
            '}' +
            '#colorizr .clrz-color {' +
                'display: none !important' +
            '}' +
            '#colorizr .clrz-rule > * {' +
                'vertical-align: middle !important;' +
            '}' +
            '#colorizr .clrz-even-row {' +
                'width: 100% !important;' +
                'background-color: #f9f9f9 !important;' +
            '}' +
            '#colorizr .sp-replacer {' +
                'margin-left: 30px !important;' +
            '}' +
            '#colorizr .clrz-target, #colorizr .clrz-attr, #colorizr .clrz-cssattr {' +
                'font-family: "Courier New", Courier, monospace !important;' +
            '}' +
            '#colorizr .clrz-apply {' +
                'color: #4a86e8 !important' +
            '}' +
            '#colorizr .clrz-apply:hover {' +
                'text-decoration: underline !important;' +
                'cursor: pointer !important;' +
            '}' +
            '#colorizr .clrz-title-title, #colorizr .clrz-title {' +
                'width: 200px !important;' +
            '}' +
            '#colorizr .clrz-title-target, #colorizr .clrz-target {' +
                'width: 350px !important;' +
            '}' +
            '#colorizr .clrz-title-attr, #colorizr .clrz-attr {' +
                'width: 200px !important;' +
            '}' +
            '#colorizr .clrz-title-cssattr, #colorizr .clrz-cssattr {' +
                'width: 250px !important;' +
            '}' +
        '</style>');

    var panel = $('<div id="colorizr" class="clrz-panel clrz-reset">');
    panel.append($('<div class="clrz-header clrz-reset">' +
        '<div class="clrz-title-title clrz-reset">Title</div>' +
        '<div class="clrz-title-target clrz-reset">CSS-Selector</div>' +
        '<div class="clrz-title-attr clrz-reset">Attribute</div>' +
        '<div class="clrz-title-cssattr clrz-reset">CSS-Attribute</div>' +
        '</div>'));

    var ruleContainer = $('<div class="clrz-rule-container clrz-reset">');

    var ruleContainerScroller = $('<div class="clrz-rule-container-scroller clrz-reset"></div>');
    ruleContainer.append(ruleContainerScroller);

    ruleContainer.append($('<div class="clrz-shadow clrz-reset">'));
    panel.append(ruleContainer);

    var widgetTemplate =
    '<div class="clrz-rule clrz-reset">' +
        '<input type="text" class="clrz-title clrz-reset"/>' +
        '<input type="text" class="clrz-target clrz-reset"/>' +
        '<input type="text" class="clrz-attr clrz-reset" value="style"/>' +
        '<input type="text" class="clrz-cssattr clrz-reset"/>' +
        '<button class="clrz-apply clrz-reset">Apply</button>' +
    '</div>';

    function buttonClickHandler () {

        var widget = $(this).parent();

        var oldColorpicker = widget.find('.clrz-color')
        if (oldColorpicker.length > 0) {
            oldColorpicker.spectrum('destroy');
            oldColorpicker.remove();
        }

        var target = widget.find('.clrz-target').val();
        var attr = widget.find('.clrz-attr').val();
        var cssattr = widget.find('.clrz-cssattr').val();
        var colorpicker = $('<input type="text" class="clrz-color clrz-reset" data-target="' + target + '" data-attr="' + attr + '" data-cssattr="' + cssattr + '"/>');
        colorpicker.appendTo(widget);

        function getColor() {
            if (cssattr !== '') {
                return $(target).first().css(cssattr);
            } else if (attr !== '') {
                return $(target).first().attr(attr);
            }
            return '';
        }

        function setColor(color) {
            // $(target) is not cached since page might dynamically create new matching elements.
            if (cssattr !== '') {
                $(target).css(cssattr, color);
            } else if (attr !== '') {
                $(target).attr(attr, color);
            }
        }

        colorpicker.spectrum({
            color: getColor(),
            showInput: true,
            showAlpha: true,
            showPalette: true,
            palette: [
                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
                ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)"],
                ["rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"],
                ["rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"],
                ["rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"],
                ["rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
            ],
            showSelectionPalette: true,
            clickoutFiresChange: true,
            showInitial: true,
            preferredFormat: "hex",
            localStorageKey: "colorizr.colors",
            change: setColor,
            move: setColor,
            hide: setColor
        });

    }

    for ( var i = 0; i < 10; i++ ) {
        var widget = $(widgetTemplate);
        if (i%2 === 0) {
            widget.addClass('clrz-even-row');
        }
        widget.appendTo(ruleContainerScroller);
        widget.find('button').click(buttonClickHandler);
    }

    panel.appendTo('body');

    $('#colorizr button').click();

}(window.jQuery));
