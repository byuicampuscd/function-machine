    var xMemory = [],
        inputs = document.querySelectorAll("input[type='number']"),
        inputCount = inputs.length,
        lastSheet = document.styleSheets[document.styleSheets.length - 1];

    /*
    Animation path for the stairstep
    */
    function stairStep(options) {
        "use strict";
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
            startTopOff: 55,
            startLeftOff: 300,
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
    Set all the data to an array of objects to be iterated
    over by the promise chain in animatorcontrol.js
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
                equation: profOpt.equation
            },
            aniSettings = {
                datapoints: [],
                currentRound: 0,
                graphOpt: graphOpt
            };

        xinputs.each(function (i) {
            var xval = +$(this).val();
            //                equation = profOpt.equation;

            if (xval) {
                var replaceX = graphOpt.equation.replace("x", `(${xval})`),
                    yval = math.eval(replaceX),
                    inputCoor = this.getBoundingClientRect(),
                    point = {
                        x: xval,
                        y: yval,
                        id: i,
                        changeEqu: profOpt.equation.replace("x", `(${xval})`),
                        updatePoint: xMemory[i] !== xval,
                        element: $("#numContainer p").get(i)
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

    //Function to select the chosen equation with its name and graph window boundaries.
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
        if (e.which == 13) {
            startFuncMach();
        }
    });

    /*
    GO! Click event handler
    */
    $("input[type='button'][value='Go!']").click(function () {
        startFuncMach();
    });
