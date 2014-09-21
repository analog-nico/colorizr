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


    $('head').append('<style type="text/css">#colorizr .clrz-reset,#colorizr.clrz-reset{animation:none!important;-webkit-appearance:none!important;-moz-appearance:none!important;appearance:none!important;background-color:transparent!important;background-image:none!important;border:0!important;bottom:auto!important;-webkit-box-shadow:none!important;-moz-box-shadow:none!important;box-shadow:none!important;box-sizing:border-box!important;clear:none!important;color:#333!important;columns:auto auto!important;content:normal!important;cursor:auto!important;direction:ltr!important;display:inline!important;filter:none!important;float:none!important;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif!important;font-size:16px!important;font-stretch:normal!important;font-style:normal!important;font-variant:normal!important;font-weight:400!important;hanging-punctuation:none!important;height:auto!important;hyphens:none!important;left:auto!important;letter-spacing:normal!important;line-height:normal!important;list-style:disc!important;margin:0!important;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:1!important;orphans:2!important;outline:0!important;overflow:visible!important;overflow-x:visible!important;overflow-y:visible!important;padding:0!important;perspective:none!important;pointer-events:auto!important;position:static!important;right:auto!important;tab-size:8!important;table-layout:auto!important;text-align:left!important;text-align-last:auto!important;text-decoration:none!important;text-indent:0!important;text-overflow:clip!important;text-shadow:none!important;text-transform:none!important;top:auto!important;transform:none!important;vertical-align:baseline!important;visibility:visible!important;white-space:normal!important;widows:2!important;width:auto!important;word-break:normal!important;word-spacing:normal!important;z-index:auto!important;zoom:1!important}#colorizr div.clrz-reset{display:inline-block!important}#colorizr option.clrz-reset{display:block!important}#colorizr.clrz-panel{width:100%!important;height:210px!important;position:fixed!important;bottom:0!important;left:0!important;right:0!important;z-index:9999!important;background-color:#fff!important;-webkit-box-shadow:0 0 6px -6px #000!important;-moz-box-shadow:0 0 6px 0 #000!important;box-shadow:0 0 6px 0 #000!important;padding:30px!important}#colorizr .clrz-header,#colorizr .clrz-rule{min-height:30px!important}#colorizr .clrz-header{width:100%!important;border-bottom:1px solid #aaa!important}#colorizr .clrz-title-manipulation,#colorizr .clrz-title-name,#colorizr .clrz-title-target,#colorizr .clrz-title-title{font-weight:700!important;vertical-align:top!important}#colorizr .clrz-rule-container{height:135px!important;width:100%!important;position:relative!important}#colorizr .clrz-rule-container-scroller{overflow-y:scroll!important;position:absolute!important;top:0!important;bottom:0!important;left:0!important;right:0!important;padding-bottom:20px!important}#colorizr .clrz-shadow{box-shadow:inset 0 -20px 10px -10px #fff!important;position:absolute!important;height:20px!important;bottom:0!important;left:0!important;right:0!important}#colorizr .clrz-color{display:none!important}#colorizr .clrz-rule>*{vertical-align:middle!important}#colorizr .clrz-even-row{width:100%!important;background-color:#f9f9f9!important}#colorizr .sp-replacer{margin-left:15px!important}#colorizr .clrz-name,#colorizr .clrz-target{font-family:"Courier New",Courier,monospace!important}#colorizr .clrz-apply{color:#4a86e8!important;display:none!important}#colorizr .clrz-apply:hover{text-decoration:underline!important;cursor:pointer!important}#colorizr .clrz-title,#colorizr .clrz-title-title{width:200px!important;padding-right:15px!important}#colorizr .clrz-target,#colorizr .clrz-title-target{width:350px!important;padding-right:15px!important}#colorizr .clrz-manipulation,#colorizr .clrz-title-manipulation{width:150px!important}#colorizr .clrz-manipulation:hover{text-decoration:underline!important;cursor:pointer!important}#colorizr .clrz-name,#colorizr .clrz-title-name{width:200px!important;padding-right:15px!important}#colorizr #clrz-palette{height:22px!important;width:150px!important;background-color:#fff!important;cursor:pointer!important;margin-right:15px!important}#colorizr #clrz-palette,#colorizr #clrz-saved-palettes{-webkit-box-shadow:0 1px 3px 1px #999!important;-moz-box-shadow:0 1px 3px 1px #999!important;box-shadow:0 1px 3px 1px #999!important}#colorizr #clrz-palette.clrz-alpha,#colorizr .clrz-saved-palette.clrz-alpha{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)!important}#colorizr #clrz-palette .clrz-palette-color,#colorizr .clrz-saved-palette .clrz-palette-color{height:100%!important;cursor:pointer!important}#colorizr #clrz-save{cursor:pointer!important;color:#4a86e8!important;vertical-align:top!important}#colorizr #clrz-save:hover{text-decoration:underline!important}#colorizr #clrz-save.clrz-hide{display:none!important}#colorizr #clrz-palettes-container{position:absolute!important;top:0!important;bottom:0!important;left:0!important;right:0!important;background-color:transparent!important}#colorizr #clrz-saved-palettes{overflow-y:scroll!important;position:absolute!important;width:150px!important;background-color:#fff!important;text-align:center!important;cursor:default!important;color:#666!important}#colorizr div.clrz-saved-palette{width:100%!important;height:22px!important;display:block!important;border-bottom:1px solid #fff!important}#colorizr:after{content:\'Colorizr.js\'!important;position:absolute!important;top:7px!important;right:7px!important;color:#aaa!important;font-weight:700!important}</style>');

    var panel = $('<div id="colorizr" class="clrz-panel clrz-dont-colorize clrz-reset">');
    panel.append($('<div class="clrz-header clrz-reset">' +
        '<div class="clrz-title-title clrz-reset">For better recollection</div>' +
        '<div class="clrz-title-target clrz-reset">HTML Element Selector (jQuery style)</div>' +
        '<div class="clrz-title-manipulation clrz-reset">Manipulation of</div>' +
        '<div class="clrz-title-name clrz-reset">Prop / Attrib Name</div>' +
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
                getTargetElements(target).attr(name, color);
            } else {
                getTargetElements(target).css(name, color);
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
        colorinput.spectrum((getTargetElements(target).length > 0) ? 'enable' : 'disable');

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

    function getTargetElements(target) {
        // $(target) is not cached since page might dynamically create new matching elements.

        if (target === '') {
            return $('');
        }

        return $(target).filter(function () {
            if ($(this).hasClass('clrz-dont-colorize')) {
                return false;
            }
            return $(this).parents().filter(function () {
                return $(this).hasClass('clrz-dont-colorize');
            }).length === 0;
        });
    }

    var lastTargetElements = null;

    function focusTarget() {
        unfocusTarget();
        /*jshint validthis:true */
        var newTarget = $(this).val();
        var newTargetElements = getTargetElements(newTarget);
        newTargetElements.css('outline', '2px dashed red');
        lastTargetElements = newTargetElements;
    }

    function unfocusTarget() {
        if (lastTargetElements !== null) {
            lastTargetElements.css('outline', 'none');
            lastTargetElements = null;
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

        widget.find('.clrz-title')
            .keyup(enableSave);

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
