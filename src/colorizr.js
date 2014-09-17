/*!
 * Colorizr.js | https://github.com/analog-nico/colorizr | Author: Nicolai Kamenzky | License: ISC
 */
(function ($) {
    'use strict';

    if ($ === undefined) {
        alert('To use colorizr.js please load jQuery first.');
        return;
    } else if ($.fn.spectrum === undefined) {
        alert('To use colorizr.js please load Spectrum (the color picker) first.');
        return;
    }

    $('head').append('<style type="text/css">/*:= css :*/</style>');

    var panel = $('<div id="colorizr" class="clrz-panel clrz-reset">');
    panel.append($('<div class="clrz-header clrz-reset">' +
        '<div class="clrz-title-title clrz-reset">Title to remember</div>' +
        '<div class="clrz-title-target clrz-reset">HTML Element Selector</div>' +
        '<div class="clrz-title-manipulation clrz-reset">Manipulation of</div>' +
        '<div class="clrz-title-name clrz-reset">Property or Attribute Name</div>' +
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
        '<select class="clrz-manipulation clrz-reset">' +
            '<option class="clrz-reset" value="css" selected>CSS Property</option>' +
            '<option class="clrz-reset" value="html">HTML Attribute</option>' +
        '</select>' +
        '<input type="text" class="clrz-name clrz-reset"/>' +
        '<button class="clrz-apply clrz-reset">Update --&gt;</button>' +
    '</div>';

    function buttonClickHandler () {

        /*jshint validthis:true */
        var widget = $(this).parent();

        var oldColorpicker = widget.find('.clrz-color');
        if (oldColorpicker.length > 0) {
            oldColorpicker.spectrum('destroy');
            oldColorpicker.remove();
        }

        var target = widget.find('.clrz-target').val();

        var manipulation = widget.find('.clrz-manipulation').val();
        var name = widget.find('.clrz-name').val();
        var attr = '';
        var cssattr = name;
        if (manipulation === 'html') {
            attr = name;
            cssattr = '';
        }

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

    var lastTarget = null;

    function focusTarget() {
        unfocusTarget();
        /*jshint validthis:true */
        var newTarget = $(this).val();
        if (newTarget !== '') {
            $(newTarget).css('outline', '2px dashed red');
            lastTarget = newTarget;
        }
    }

    function unfocusTarget() {
        if (lastTarget !== null) {
            $(lastTarget).css('outline', 'none');
            lastTarget = null;
        }
    }

    for ( var i = 0; i < 12; i+=1 ) {

        var widget = $(widgetTemplate);
        if (i%2 === 0) {
            widget.addClass('clrz-even-row');
        }
        widget.appendTo(ruleContainerScroller);

        widget.find('button').click(buttonClickHandler).click();

        widget.find('.clrz-target')
            .focusin(focusTarget)
            .keyup(focusTarget)
            .focusout(unfocusTarget);

    }

    panel.appendTo('body');
    $('body').css('margin-bottom', '210px');

}(window.jQuery));
