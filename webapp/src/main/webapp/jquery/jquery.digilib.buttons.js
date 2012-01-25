/**
digilib buttons plugin
 */

(function($) {

    // plugin object with digilib data
    var digilib;

    var buttons = {
            reference : {
                onclick : "reference",
                tooltip : "get a reference URL",
                icon : "reference.png"
                },
            zoomin : {
                onclick : ["zoomBy", 1.4],
                tooltip : "zoom in",
                icon : "zoom-in.png"
                },
            zoomout : {
                onclick : ["zoomBy", 0.7],
                tooltip : "zoom out",
                icon : "zoom-out.png"
                },
            zoomarea : {
                onclick : "zoomArea",
                tooltip : "zoom area",
                icon : "zoom-area.png"
                },
            zoomfull : {
                onclick : "zoomFull",
                tooltip : "view the whole image",
                icon : "zoom-full.png"
                },
            pagewidth : {
                onclick : ["zoomFull", "width"],
                tooltip : "page width",
                icon : "pagewidth.png"
                },
            back : {
                onclick : ["gotoPage", "-1"],
                tooltip : "goto previous image",
                icon : "back.png"
                },
            fwd : {
                onclick : ["gotoPage", "+1"],
                tooltip : "goto next image",
                icon : "fwd.png"
                },
            page : {
                onclick : "gotoPage",
                tooltip : "goto image number",
                icon : "page.png"
                },
            help : {
                onclick : "showAboutDiv",
                tooltip : "about Digilib",
                icon : "help.png"
                },
            reset : {
                onclick : "reset",
                tooltip : "reset image",
                icon : "reset.png"
                },
            mark : {
                onclick : "setMark",
                tooltip : "set a mark",
                icon : "mark.png"
                },
            delmark : {
                onclick : "removeMark",
                tooltip : "delete the last mark",
                icon : "delmark.png"
                },
            hmir : {
                onclick : ["mirror", "h"],
                tooltip : "mirror horizontally",
                icon : "mirror-horizontal.png"
                },
            vmir : {
                onclick : ["mirror", "v"],
                tooltip : "mirror vertically",
                icon : "mirror-vertical.png"
                },
            rot : {
                onclick : "rotate",
                tooltip : "rotate image",
                icon : "rotate.png"
                },
            brgt : {
                onclick : "brightness",
                tooltip : "set brightness",
                icon : "brightness.png"
                },
            cont : {
                onclick : "contrast",
                tooltip : "set contrast",
                icon : "contrast.png"
                },
            rgb : {
                onclick : "javascript:setParamWin('rgb', '...')",
                tooltip : "set rgb values",
                icon : "rgb.png"
                },
            quality : {
                onclick : "setQuality",
                tooltip : "set image quality",
                icon : "quality.png"
                },
            size : {
                onclick : "javascript:toggleSizeMenu()",
                tooltip : "set page size",
                icon : "size.png"
                },
            calibrationx : {
                onclick : "calibrate",
                tooltip : "calibrate screen resolution",
                icon : "calibration-x.png"
                },
            scale : {
                onclick : "setScaleMode",
                tooltip : "change image scale",
                icon : "original-size.png"
                },
            toggleoptions : {
                onclick : "moreButtons",
                tooltip : "more options",
                icon : "options.png"
                },
            moreoptions : {
                onclick : ["moreButtons", "+1"],
                tooltip : "more options",
                icon : "options.png"
                },
            lessoptions : {
                onclick : ["moreButtons", "-1"],
                tooltip : "less options",
                icon : "options.png"
                },
            up : {
                onclick : ["moveZoomArea", 0, -1],
                tooltip : "move zoom area up",
                icon : "up.png"
                },
            down : {
                onclick : ["moveZoomArea", 0, 1],
                tooltip : "move zoom area down",
                icon : "down.png"
                },
            left : {
                onclick : ["moveZoomArea", -1, 0],
                tooltip : "move zoom area left",
                icon : "left.png"
                },
            right : {
                onclick : ["moveZoomArea", 1, 0],
                tooltip : "move zoom area right",
                icon : "right.png"
                },
            SEP : {
                icon : "sep.png"
                }
            };

    var defaults = {
            // buttons (reference added later)
            'buttons' : null,
            // defaults for digilib buttons
            'buttonSettings' : {
                'fullscreen' : {
                    // path to button images (must end with a slash)
                    'imagePath' : 'img/fullscreen/',
                    'buttonSetWidth' : 36,
                    'standardSet' : ["reference","zoomin","zoomout","zoomarea","zoomfull","pagewidth","back","fwd","page","help","reset","toggleoptions"],
                    'specialSet' : ["mark","delmark","hmir","vmir","rot","brgt","cont","rgb","quality","size","calibrationx","scale","lessoptions"],
                    'arrowSet' : ["up", "down", "left", "right"],
                    'buttonSets' : ['standardSet', 'specialSet']
                    },
                'embedded' : {
                    'imagePath' : 'img/embedded/16/',
                    'buttonSetWidth' : 18,
                    'standardSet' : ["reference","zoomin","zoomout","zoomarea","zoomfull","help","reset","toggleoptions"],
                    'specialSet' : ["mark","delmark","hmir","vmir","rot","brgt","cont","rgb","quality","scale","lessoptions"],
                    'arrowSet' : ["up", "down", "left", "right"],
                    'buttonSets' : ['standardSet', 'specialSet']
                    }
            },
            // number of visible button groups
            'visibleButtonSets' : 1
    };

    var actions = {
            // display more (or less) button sets
            moreButtons : function (data, more) {
                var settings = data.settings;
                if (more == null) {
                    // toggle more or less (only works for 2 sets)
                    var maxbtns = settings.buttonSettings[settings.interactionMode].buttonSets.length;
                    if (settings.visibleButtonSets >= maxbtns) {
                        more = '-1';
                    } else {
                        more = '+1';
                    }
                }
                if (more === '-1') {
                    // remove set
                    var setIdx = settings.visibleButtonSets - 1;
                    if (showButtons(data, false, setIdx, true)) {
                        settings.visibleButtonSets--;
                    }
                } else {
                    // add set
                    var setIdx = settings.visibleButtonSets;
                    if (showButtons(data, true, setIdx, true)) {
                        settings.visibleButtonSets++;
                    }
                }
                // persist setting
                digilib.fn.storeOptions(data);
            },

    };

    // plugin installation called by digilib on plugin object.
    var install = function(plugin) {
        digilib = plugin;
        console.debug('installing buttons plugin. digilib:', digilib);
        // add defaults, actions, buttons
        $.extend(digilib.defaults, defaults);
        $.extend(digilib.actions, actions);
        $.extend(digilib.buttons, buttons);
        // update buttons reference in defaults
        digilib.defaults.buttons = digilib.buttons;
        // export functions
        digilib.fn.createButton = createButton;
        digilib.fn.highlightButtons = highlightButtons;
    };

    // plugin initialization
    var init = function (data) {
        console.debug('initialising buttons plugin. data:', data);
        /* create buttons before scaler 
        for (var i = 0; i < data.settings.visibleButtonSets; ++i) {
            showButtons(data, true, i);
        } */
        // install event handler
        var $data = $(data);
        $data.bind('setup', handleSetup);
    };


    var handleSetup = function (evt) {
        console.debug("stub: handleSetup");
        var data = this;
        // create buttons before scaler 
        for (var i = 0; i < data.settings.visibleButtonSets; ++i) {
            showButtons(data, true, i);
        }
    };

    // creates HTML structure for a single button
    var createButton = function (data, $div, buttonName) {
        var $elem = data.$elem;
        var settings = data.settings;
        var mode = settings.interactionMode;
        var imagePath = settings.buttonSettings[mode].imagePath;
        // make relative imagePath absolute
        if (imagePath.charAt(0) !== '/' && imagePath.substring(0,3) !== 'http') {
        	imagePath = settings.digilibBaseUrl + '/jquery/' + imagePath;
        }
        var buttonConfig = settings.buttons[buttonName];
        // button properties
        var action = buttonConfig.onclick;
        var tooltip = buttonConfig.tooltip;
        var icon = imagePath + buttonConfig.icon;
        // construct the button html
        var $button = $('<div class="button"></div>');
        var $a = $('<a/>');
        var $img = $('<img class="button"/>');
        $div.append($button);
        $button.append($a);
        $a.append($img);
        // add attributes and bindings
        $button.attr('title', tooltip);
        $button.addClass('button-' + buttonName);
        $img.attr('src', icon);
        // create handler for the buttons
        $button.on('click.digilib', (function () {
            // we create a new closure to capture the value of action
            if ($.isArray(action)) {
                // the handler function calls digilib with action and parameters
                return function (evt) {
                    console.debug('click action=', action, ' evt=', evt);
                    $elem.digilib.apply($elem, action);
                    return false;
                };
            } else {
                // the handler function calls digilib with action
                return function (evt) {
                    console.debug('click action=', action, ' evt=', evt);
                    $elem.digilib(action);
                    return false;
                };
            }
        })());
    };

    // creates HTML structure for buttons in elem
    var createButtons = function (data, buttonSetIdx) {
        var $elem = data.$elem;
        var settings = data.settings;
        var mode = settings.interactionMode;
        var buttonSettings = settings.buttonSettings[mode];
        var buttonGroup = buttonSettings.buttonSets[buttonSetIdx];
        if (buttonGroup == null) {
            // no buttons here
            return;
        }
        // button divs are marked with class "keep"
        var $buttonsDiv = $('<div class="keep buttons"/>');
        var buttonNames = buttonSettings[buttonGroup];
        for (var i = 0; i < buttonNames.length; i++) {
            var buttonName = buttonNames[i];
            createButton(data, $buttonsDiv, buttonName);
        }
        // make buttons div scroll if too large for window
        if ($buttonsDiv.height() > $(window).height() - 10) {
            $buttonsDiv.css('position', 'absolute');
        }
        // buttons hidden at first
        $buttonsDiv.hide();
        $elem.append($buttonsDiv);
        if (data.$buttonSets == null) {
            // first button set
            data.$buttonSets = [$buttonsDiv];
        } else {
            $elem.append($buttonsDiv);
            data.$buttonSets[buttonSetIdx] = $buttonsDiv;
        }
        return $buttonsDiv;
    };

    // display more (or less) button sets
    var showButtons = function (data, more, setIdx, animated) {
        var atime = animated ? 'fast': 0;
        // get button width from settings
        var mode = data.settings.interactionMode;
        var btnWidth = data.settings.buttonSettings[mode].buttonSetWidth;
        if (more) {
            // add set
            var $otherSets = data.$elem.find('div.buttons:visible');
            var $set;
            if (data.$buttonSets && data.$buttonSets[setIdx]) {
                // set exists
                $set = data.$buttonSets[setIdx];
            } else {
                $set = createButtons(data, setIdx);
                }
            if ($set == null) return false;
            // include border in calculation
            //var btnWidth = $set.outerWidth();
            // console.debug("btnWidth", btnWidth);
            // move remaining sets left and show new set
            if ($otherSets.length > 0) {
                    $otherSets.animate({right : '+='+btnWidth+'px'}, atime,
                            function () {$set.show();});
            } else {
                $set.show();
            }
        } else {
            // remove set
            var $set = data.$buttonSets[setIdx];
            if ($set == null) return false;
            //var btnWidth = $set.outerWidth();
            // hide last set
            $set.hide();
            // take remaining sets and move right
            var $otherSets = data.$elem.find('div.buttons:visible');
            $otherSets.animate({right : '-='+btnWidth+'px'}, atime);
        }
        return true;
    };

    // check for buttons to highlight TODO: improve this!
    var highlightButtons = function (data, name, on) {
        var $buttons = data.$elem.find('div.buttons:visible'); // include hidden?
        // add a class for highlighted button
        var highlight = function (name, on) {
            var $button = $buttons.find('div.button-' + name);
            if (on) {
                $button.addClass('button-on');
            } else {
                $button.removeClass('button-on');
            }
        };
        if (name != null) {
            return highlight(name, on);
            }
        var flags = data.scalerFlags;
        var settings = data.settings;
        highlight('rot', settings.rot);
        highlight('brgt', settings.brgt);
        highlight('cont', settings.cont);
        highlight('bird', settings.isBirdDivVisible);
        highlight('help', settings.isAboutDivVisible);
        highlight('hmir', flags.hmir);
        highlight('vmir', flags.vmir);
        highlight('quality', flags.q1 || flags.q2);
        highlight('zoomin', ! isFullArea(data.zoomArea));
        };

    // plugin object with name and init
    // shared objects filled by digilib on registration
    var plugin = {
            name : 'buttons',
            install : install,
            init : init,
            buttons : {},
            actions : {},
            fn : {},
            plugins : {}
    };

    if ($.fn.digilib == null) {
        $.error("jquery.digilib.buttons must be loaded after jquery.digilib!");
    } else {
        $.fn.digilib('plugin', plugin);
    }
})(jQuery);