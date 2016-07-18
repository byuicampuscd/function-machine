/*
Set up the basic variables.
*/
var xMemory = [],
    inputs = document.querySelectorAll("input[type='number']"),
    inputCount = inputs.length,
    run = true;

/*
Attach an oninput event to all the input boxes in order to validate them within the bounds
that the professor has chosen.  If the bounds are exceeded, then disable the "Go!" button
and output a message to the status bar.
*/
for (var i = 0; i < inputs.length; i++) {

    inputs[i].oninput = function (e) {

        var xInputVal = e.srcElement.value;
        if (profOpt.view.x.min <= xInputVal && xInputVal <= profOpt.view.x.max) {
            run = true;
            $("input[type='button'][value='Go!']")
                .prop("disabled", false)
                .css({
                    "cursor": "pointer"
                });
            $("#status p").html(``);
        } else {
            run = false;
            $("input[type='button'][value='Go!']")
                .prop("disabled", true)
                .css({
                    "cursor": "not-allowed"
                });
            $("#status p").html(`${xInputVal} x-value out of domains.`);
        }
    };
}

/*
Dipslay Katex equation. ALSO used in ajax.js
*/
function changePlot(val) {

    xMemory = [];

    clearValues();

    window.profOpt = checkConfig(val);
    var y = `y = `,
        equat = `${val}`,
        equPara = $("#functionMachine #equ")[0],
        yPara = $("#functionMachine #y");

    $(equPara).empty("");

    katex.render(y, yPara[0]);
    katex.render(equat, equPara);
}

/*
Animation path for the stairstep
*/
function stairStep(options) {
    "use strict";
    var highwayPath = 246.5,
        lastSheet = document.styleSheets[document.styleSheets.length - 1];
    lastSheet.insertRule(`@keyframes ${options.name} {
                            0% {
                                opacity: 1;
                                top: ${options.startTopOff}px;
                                left: ${options.startLeftOff}px;
                            }
                            10% {
                                opacity: 1;
                            }
                            33% {
                                top: ${options.startTopOff}px;
                                left: ${highwayPath}px;
                            }
                            66% {
                                top: ${options.endTopOff}px;
                                left: ${highwayPath}px;
                            }
                            90% {
                                opacity: 1;
                            }
                            100% {
                                opacity: 0;
                                top: ${options.endTopOff}px;
                                left: ${options.endLeftOff}px;
                            }
                        }`, lastSheet.cssRules.length);
}

/*
A set of functions using the stairstep animation template
to create pathways with coordinate data
*/
function makeXToMachine(inputCords, index) {
    "use strict";
    stairStep({
        startTopOff: inputCords.top + 5,
        startLeftOff: inputCords.left + 30,
        endTopOff: 55,
        endLeftOff: 300,
        name: `xToMachine${index}`
    });
}

function makeMachineToY(inputCords, index) {
    "use strict";
    stairStep({
        startTopOff: 100,
        startLeftOff: 530,
        endTopOff: inputCords.top + 5,
        endLeftOff: inputCords.right + 5,
        name: `machineToY${index}`
    });
}

function makeYToStatusBar(inputCords, index) {
    "use strict";
    stairStep({
        startTopOff: inputCords.top + 5,
        startLeftOff: inputCords.right + 10,
        endTopOff: 150,
        endLeftOff: 300,
        name: `yToStatusBar${index}`
    });
}

/*
Set up the xMemory array and the animation paths for each input box.

NOTE: Setting up the xMemory array also makes it so that no animations
      are repeated by multiple clicks on the "Go!" button.
*/
for (var i = 0; i < inputCount; i++) {
    xMemory[i] = null;

    var inputCoor = inputs[i].getBoundingClientRect();

    makeXToMachine(inputCoor, i);
    makeMachineToY(inputCoor, i);
    makeYToStatusBar(inputCoor, i);
    $("#numContainer").append($(`<p></p>`));
}

/*
Set up the object that will be passed through the promise chain
in animatorcontrol.
*/
function setUpObject(xinputs, graphOpt, aniSettings) {
    xinputs.each(function (i) {
        var xvalue = $(this).val(),
            xval,
            roundit;

        if (xvalue) {
            xval = +xvalue;
            roundit = xval.toFixed(profOpt.rounding);

            $(this).val(roundit);

            if (profOpt.view.x.min <= roundit && roundit <= profOpt.view.x.max) {

                var replaceX = graphOpt.equation.replace("x", `(${roundit})`),
                    yval = math.eval(replaceX),
                    inputCoor = this.getBoundingClientRect(),
                    point = {
                        x: roundit,
                        y: yval.toFixed(profOpt.rounding),
                        id: i,
                        changeEqu: profOpt.equation.replace("x", `(${roundit})`),
                        updatePoint: xMemory[i] !== roundit,
                        element: $("#numContainer p").get(i)
                    };

                /*
                Clear out the Ys when they don't equal each other and need to be updated
                */
                if (point.updatePoint) {
                    $(`td#yval${i + 1}`).html("");
                }

                /*Update the xmemory*/
                xMemory[i] = roundit;
                aniSettings.datapoints.push(point);
            }
        }
    });
}

/*
Set all the data that will be set to aniSettings in the setUpObject function

NOTE
graphOpt.callback still needs a viable method!
*/
function startFuncMach() {

    var xinputs = $("input[type='number']"),
        hideAnimationChecked = $("#animate:checked").length > 0,
        hideGraphChecked = $("#showGraph:checked").length > 0,
        graphOpt = {
            callback: function (aniSettings) {
                return new Promise(function (resolve) {
                    console.log("finished plotting datapoint!");
                    resolve(aniSettings);
                });
            },
            animateHide: hideAnimationChecked,
            graphHide: hideGraphChecked,
            equation: profOpt.equation,
            view: profOpt.view
        },
        aniSettings = {
            datapoints: [],
            currentRound: 0,
            graphOpt: graphOpt
        };

    setUpObject(xinputs, graphOpt, aniSettings);
    animatorControl(aniSettings);
}

/*
Function to select the chosen equation with its name and graph window boundaries.
*/
function checkConfig(val) {
    var profOpt;
    $.each(professorConfigFile, function (i, item) {
        if (item.equation === val) {
            profOpt = item;
        }
    })
    return profOpt;
}

/*
Upon choosing another equation to graph, clear all the values
*/
function clearValues() {
    var xinputs = $("input[type='number']"),
        yinputs = $(`tr td:nth-of-type(2)`);

    xinputs.each(function (i, item) {
        item.value = "";
    });

    yinputs.each(function (i, item) {
        item.innerHTML = "";
    });
}

/*
Onchange event handler for the select html element.
*/
$("select").change(function (e) {
    changePlot(e.target.value);
});

/*
DOCUMENT keydown event handler
*/
$(document).keypress(function (e) {
    if (e.which == 13 && run) {
        startFuncMach();
    }
});

/*
GO! Click event handler
*/
$("input[type='button'][value='Go!']").click(function () {
    if (run) {
        startFuncMach();
    }
});
