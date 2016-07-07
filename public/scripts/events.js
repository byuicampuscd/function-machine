var xMemory = [],
    inputs = document.querySelectorAll("input[type='number']"),
    inputCount = inputs.length,
    lastSheet = document.styleSheets[document.styleSheets.length - 1];

function stairStep(options) {
    var highwayPath = 246.5;
    lastSheet.insertRule(`@keyframes ${options.name} {
                            0% {
                                opacity: 0;
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

function makeXToMachine(inputCords, index) {
    stairStep({
        startTopOff: inputCords.top + 5,
        startLeftOff: inputCords.left + 30,
        endTopOff: 55,
        endLeftOff: 300,
        name: `xToMachine${index}`
    });
}

function makeMachineToY(inputCords, index) {
    stairStep({
        startTopOff: 55,
        startLeftOff: 300,
        endTopOff: inputCords.top + 5,
        endLeftOff: inputCords.right + 5,
        name: `machineToY${index}`
    });
}

function makeYToStatusBar(inputCords, index) {
    stairStep({
        startTopOff: inputCords.top ,
        startLeftOff: inputCords.right + 10,
        endTopOff: 150,
        endLeftOff: 300,
        name: `yToStatusBar${index}`
    });
}

for (var i = 0; i < inputCount; i++) {
    xMemory[i] = null;

    var inputCoor = inputs[i].getBoundingClientRect();

    makeXToMachine(inputCoor,i);
    makeMachineToY(inputCoor,i);
    makeYToStatusBar(inputCoor,i);
    $("#numContainer").append($(`<p></p>`));
}



function startFuncMach() {

    var xinputs = $("input[type='number']"),
        hideAnimationChecked = $("#animate:checked").length > 0,
        hideGraphChecked = $("#showGraph:checked").length > 0,
        graphOpt = {
            callback: function (aniSettings) {
                return new Promise(function (resolve) {
                    console.log("finished!");
                    resolve(aniSettings);
                });
            },
            animateHide: hideAnimationChecked,
            graphHide: hideGraphChecked,
            equation: profOpt.equation
        },
        aniSettings = {
            datapoints: [],
            currentRound: 0,
            graphOpt: graphOpt
        };

    xinputs.each(function (i) {
        var xval = +$(this).val(),
            equation = profOpt.equation;

        if (xval) {
            var replaceX = equation.replace("x", `(${xval})`),
                yval = math.eval(replaceX),
                inputCoor = this.getBoundingClientRect(),
                point = {
                    x: xval,
                    y: yval,
                    id: i,
                    changeEqu: profOpt.equation.replace("x", `(${xval})`),
                    updatePoint: xMemory[i] !== xval,
                    element: $("#numContainer p").get(i),
                    beginCoor: {
                        top: inputCoor.top,
                        left: inputCoor.left
                    },
                    endCoor: {
                        top: 55,
                        left: 300
                    }
                };

            /*
            Clear out the Ys when they don't equal each other and need to be updated
            */
            if (point.updatePoint) {
                $(`td#yval${i + 1}`).html("");
            }

            /*Update the xmemory*/
            xMemory[i] = xval;

            aniSettings.datapoints.push(point);
        }
    });

    animatorControl(aniSettings);
}

function checkConfig(val) {
    var profOpt;
    $.each(professorConfigFile, function (i, item) {
        if (item.equation === val) {
            profOpt = item;
        }
    })
    return profOpt;
}

//Dipslay Katex equation
function changePlot(val) {

    window.profOpt = checkConfig(val);

    var y = `y = `,
        equat = `${val}`,
        equPara = $("#functionMachine #equ")[0],
        yPara = $("#functionMachine #y");

    $(equPara).empty("");

    katex.render(y, yPara[0]);
    katex.render(equat, equPara);
}

/*****DOCUMENT onchange EVENT HANDLER*****/
$("select").change(function (e) {
    changePlot(e.target.value);
});

/****DOCUMENT keydown EVENT HANDLER****/
$(document).keypress(function (e) {
    if (e.which == 13) {
        startFuncMach();
    }
});

/*****GO! Click*****/
$("input[type='button'][value='Go!']").click(function () {

    //TODO: Most likely to detect if an animation is occurring it would be best to check of a specific animation class exists on the webpage.

    //    if ($(':animated').length === 0) {
    startFuncMach();
    //    }

});
