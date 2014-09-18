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

    var useLocalStorage = false;
    try {
        localStorage.setItem('colorizr.test', 'xyz');
        localStorage.removeItem('colorizr.test');
        useLocalStorage = true;
    } catch(e) { }

    function loadPalettes() {

        if (useLocalStorage === false) {
            return [];
        }

        var palettes = localStorage.getItem('colorizr.palettes');
        if (palettes === undefined || palettes === null || palettes === '') {
            return [];
        }

        var parsedPalettes = JSON.parse(palettes);
        if (parsedPalettes.length === undefined) {
            return [];
        }

        return parsedPalettes;

    }

    function loadAndApplyRules(rules) {

        $('#colorizr').find('.clrz-rule').each(function (i) {
            if (i >= rules.length) {
                return;
            }
            $(this).find('.clrz-title').val(rules[i].title);
            $(this).find('.clrz-target').val(rules[i].target);
            $(this).find('.clrz-manipulation').val(rules[i].manipulation);
            $(this).find('.clrz-name').val(rules[i].name);
            $(this).find('.clrz-color').val(rules[i].color);
            $(this).find('.clrz-apply').each(function () {
                reloadColorPicker.call(this, {
                    useColorInInputfield: true,
                    keepSaveDisabled: true,
                    setColor: true
                });
            });
        });

    }

    function storeRules() {

        disableSave();

        if (useLocalStorage === false) {
            return;
        }

        var rules = [];
        $('#colorizr').find('.clrz-rule').each(function (i) {
            rules[i] = {
                title: $(this).find('.clrz-title').val(),
                target: $(this).find('.clrz-target').val(),
                manipulation: $(this).find('.clrz-manipulation').val(),
                name: $(this).find('.clrz-name').val(),
                color: $(this).find('.clrz-color').val(),
                active: ($(this).find('.sp-replacer').hasClass('sp-disabled') ? false : true)
            };
        });

        var palettes = loadPalettes();
        palettes[palettes.length] = rules;

        localStorage.setItem('colorizr.palettes', JSON.stringify(palettes));

    }

    var paletteWasRecentlyUpdated = false;
    var paletteShouldAgainBeUpdated = false;

    function updatePalette() {
        if (paletteWasRecentlyUpdated) {
            paletteShouldAgainBeUpdated = true;
        } else {
            updatePaletteNow();
            paletteWasRecentlyUpdated = true;
            setTimeout(function () {
                paletteWasRecentlyUpdated = false;
                if (paletteShouldAgainBeUpdated) {
                    paletteShouldAgainBeUpdated = false;
                    updatePalette();
                }
            }, 500);
        }
    }

    function addColorsToPalette(colors, palette) {
        for (var i = 0; i < colors.length; i += 1) {
            var width = (i === 0 ?
                (150 - ((colors.length - 1) * Math.floor(150 / colors.length))) :
                Math.floor(150 / colors.length));
            palette.append(
                $('<div class="clrz-palette-color clrz-reset" style="' +
                    'background-color: ' + colors[i] + ' !important;' +
                    'width: ' + width + 'px !important;' +
                    '"></div>')
            );
        }
    }

    function updatePaletteNow() {
        var panel = $('#colorizr');
        var colors = [];
        panel.find('.clrz-color').each(function () {
            if ($(this).parent().find('.sp-replacer').hasClass('sp-disabled')) {
                return;
            }
            colors[colors.length] = $(this).val();
        });
        var palette = panel.find('#clrz-palette');
        palette.removeClass('clrz-alpha');
        palette.children().remove();
        addColorsToPalette(colors, palette);
        if (colors.length > 0) {
            palette.addClass('clrz-alpha');
        }
    }

    function showSavedPalettes() {

        var panel = $('#colorizr');
        panel.find('#clrz-palettes-container').remove();

        var container = $('<div id="clrz-palettes-container" class="clrz-reset"></div>');
        container.click(function () {
            panel.find('#clrz-palettes-container').remove();
        });

        var palettePosition = panel.find('#clrz-palette').position();

        var savedPalettes = $('<div id="clrz-saved-palettes" class="clrz-reset" style="' +
            'top: ' + (palettePosition.top + 30 - 2) + 'px !important;' +
            'left: ' + palettePosition.left + 'px !important;' +
            'height: ' + (210 - palettePosition.top - 30 - 24) + 'px !important;' +
            '"></div>');
        container.append(savedPalettes);

        function loadPalette(rules) {
            return function () {
                loadAndApplyRules(rules);
            };
        }

        var palettes = loadPalettes();
        if (palettes.length === 0) {
            savedPalettes.text('No palettes saved yet.');
        } else {
            for ( var i = palettes.length-1; i >= 0; i-=1 ) {
                var colors = [];
                for ( var k = 0; k < palettes[i].length; k+=1 ) {
                    if (!palettes[i][k].active) {
                        continue;
                    }
                    colors[colors.length] = palettes[i][k].color;
                }

                var palette = $('<div class="clrz-saved-palette clrz-reset clrz-alpha"></div>');
                addColorsToPalette(colors, palette);
                palette.click(loadPalette(palettes[i]));
                palette.appendTo(savedPalettes);
            }
        }

        container.appendTo(panel);

    }

    function enableSave() {
        if (useLocalStorage === false) {
            return;
        }
        $('#colorizr').find('#clrz-save').removeClass('clrz-hide');
    }

    function disableSave() {
        $('#colorizr').find('#clrz-save').addClass('clrz-hide');
    }


    $('head').append('<style type="text/css">/*:= css :*/</style>');

    var panel = $('<div id="colorizr" class="clrz-panel clrz-dont-colorize clrz-reset">');
    panel.append($('<div class="clrz-header clrz-reset">' +
        '<div class="clrz-title-title clrz-reset">For better recollection</div>' +
        '<div class="clrz-title-target clrz-reset">HTML Element Selector (jQuery style)</div>' +
        '<div class="clrz-title-manipulation clrz-reset">Manipulation of</div>' +
        '<div class="clrz-title-name clrz-reset">Property or Attribute Name</div>' +
        '<div id="clrz-palette" class="clrz-reset"></div>' +
        '<div id="clrz-save" class="clrz-hide clrz-reset">Save</div>' +
        '</div>'));

    panel.find('#clrz-palette').click(showSavedPalettes);
    panel.find('#clrz-save').click(storeRules);

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
        '<input type="text" class="clrz-color clrz-reset" data-target="" data-manipulation="css" data-name=""/>' +
    '</div>';

    function reloadColorPicker(options) {

        options = options || {};

        /*jshint validthis:true */
        var widget = $(this).parent();

        var colorinput = widget.find('.clrz-color');

        var target = widget.find('.clrz-target').val();
        var manipulation = widget.find('.clrz-manipulation').val();
        var name = widget.find('.clrz-name').val();

        colorinput.attr({
            'data-target': target,
            'data-manipulation': manipulation,
            'data-name': name
        });

        function getTargetElements() {
            // $(target) is not cached since page might dynamically create new matching elements.

            if (target === '') {
                return $('');
            }

            var targetWithoutColorizrPanel = 'body > *:not(.clrz-dont-colorize) ' + target;
            return $(targetWithoutColorizrPanel);
        }

        function foundTargetElements() {
            return getTargetElements().length > 0;
        }

        function getColor() {

            if (options.useColorInInputfield) {
                return colorinput.val();
            }

            if (manipulation === 'html') {
                return $(target).first().attr(name);
            } else {
                return $(target).first().css(name);
            }

        }

        function setColor(color) {
            if (manipulation === 'html') {
                getTargetElements().attr(name, color);
            } else {
                getTargetElements().css(name, color);
            }
        }

        colorinput.spectrum({
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
            preferredFormat: "rgb",
            localStorageKey: "colorizr.colors",
            containerClassName: 'clrz-dont-colorize',
            change: function () {
                setColor();
                enableSave();
                updatePalette();
            },
            move: setColor,
            hide: setColor
        });
        colorinput.spectrum('set', getColor());
        colorinput.spectrum((foundTargetElements() ? 'enable' : 'disable'));

        if (!options.keepSaveDisabled) {
            enableSave();
        } else {
            disableSave();
        }
        updatePalette();
        if (options.setColor) {
            setColor(getColor());
        }

    }

    var lastTarget = null;

    function focusTarget() {
        unfocusTarget();
        /*jshint validthis:true */
        var newTarget = $(this).val();
        if (newTarget !== '') {
            var newTargetWithoutColorizrPanel = 'body > *:not(.clrz-dont-colorize) ' + newTarget;
            $(newTargetWithoutColorizrPanel).css('outline', '2px dashed red');
            lastTarget = newTarget;
        }
    }

    function unfocusTarget() {
        if (lastTarget !== null) {
            var lastTargetWithoutColorizrPanel = 'body > *:not(.clrz-dont-colorize) ' + lastTarget;
            $(lastTargetWithoutColorizrPanel).css('outline', 'none');
            lastTarget = null;
        }
    }

    function clickApplyButton() {
        /*jshint validthis:true */
        $(this).parent().find('.clrz-apply').click();
    }

    for ( var i = 0; i < 12; i+=1 ) {

        var widget = $(widgetTemplate);
        if (i%2 === 0) {
            widget.addClass('clrz-even-row');
        }
        widget.appendTo(ruleContainerScroller);

        widget.find('.clrz-apply').click(reloadColorPicker).click();

        widget.find('.clrz-target')
            .focusin(focusTarget)
            .keyup(focusTarget)
            .keyup(clickApplyButton)
            .focusout(unfocusTarget);

        widget.find('.clrz-manipulation')
            .change(clickApplyButton);

        widget.find('.clrz-name')
            .keyup(clickApplyButton);

    }

    panel.appendTo('body');
    $('body').css('margin-bottom', '210px');

}(window.jQuery));
