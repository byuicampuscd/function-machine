(function () {
    "use strict";

    /*
    Make the whole table and cells for the input boxes and user interaction.
    */
    var tbody = $("tbody"),
        td1,
        td2,
        tr,
        input,
        rowCount = 10;

    for (var j = 1; j <= rowCount; j++) {
        input = $("<input>");
        td1 = $("<td></td>");
        td2 = $("<td></td>");
        tr = $("<tr></tr>");

        $(tr).attr("id", `row${j}`);

        $(input).attr("name", `input${j}`).attr("type", "number");

        $(td2).attr("id", `yval${j}`);

        $(td1).append(input);
        $(tr).append(td1).append(td2);
        $(tbody).append(tr);
    }
}());

/*jslint plusplus: true, browser: true, devel: true*/
/*global d3, functionPlot*/
var plotGraph = (function () {
    "use strict";
    var graphLocationSelector,
        dotLocation,
        currentEquation,
        funPlot,
        xScale,
        yScale,
        freeId = 0;

    //these two functions make the factory function that is used in the animations for the point labels
    function updateTextX(currentPoint) {
        return function (d) {
            var zero = (0).toFixed(2);

            return function (t) {
                var location = currentPoint.x * t;
                this.textContent = "( " + location.toFixed(2) + ", " + zero + ")";
            };
        };
    }

    function updateTextY(currentPoint) {
        return function () {

            var xRounded = currentPoint.x,
                yVal = currentPoint.y;

            return function (t) {
                this.textContent = "( " + xRounded + ", " + (yVal * t).toFixed(2) + ")";
            };
        };
    }

    function makePointId(numIn) {
        return 'graphPoint' + numIn;
    }

    function makePointGroup(currentPoint) {
        var pointGroup = d3.selectAll(dotLocation).append('g')
            .attr('class', 'point')
            .attr('id', makePointId(currentPoint.id));

        //add the circle
        pointGroup.append('circle')
            .attr('r', 4)
            .attr('cx', 0)
            .attr('cy', 0);

        //add the label
        pointGroup.append('text')
            .text('(0, 0)')
            .attr('x', 5)
            .attr('y', 15);
        //move it to (0,0)
        pointGroup.attr('transform', 'translate(' + xScale(0) + ' ' + yScale(0) + ')');
        return pointGroup;
    }

    function update(aniOptions, callback) {
        var currentPoint = aniOptions.datapoints[aniOptions.currentRound],
            lineIsPlotted = document.querySelectorAll(dotLocation + ' .graph .line').length > 0,
            pointGroup,
            transition;

        //clear any points that will get updated
        aniOptions.datapoints.forEach(function (point) {
            if (point.updatePoint) {
                d3.select('#' + makePointId(point.id)).remove();
            }
        });

        //check if we need to hide or show the plotline
        if (aniOptions.graphOpt.graphHide) {
            d3.select(dotLocation + ' .graph .line').attr('display', 'none');
        } else {
            d3.select(dotLocation + ' .graph .line').attr('display', 'inline');
        }

        //does the currentRound need to be updateded?
        if (!currentPoint.updatePoint) {
            //nothitng to see here just keep on moving
            callback(aniOptions);
        } else {
            //draw point
            pointGroup = makePointGroup(currentPoint);

            //is animation on?
            if (aniOptions.graphOpt.duration <= 0.5) {
                //move it into place without animation
                pointGroup.attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(currentPoint.y) + ')');
                //update the lable
                pointGroup.select('text').text('(' + currentPoint.x + ', ' + currentPoint.y + ')');
                //call callback
                callback(aniOptions);

            } else {
                //draw point with animaion
                //First transition - move the group in the X
                transition = pointGroup
                    .transition()
                    .duration(aniOptions.graphOpt.duration * 1000)
                    .ease('cubic-out')
                    .attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(0) + ')');
                //sub transition - update the label
                transition.select('text').tween('text', updateTextX(currentPoint));

                //Second transition - move the group in the Y
                //sub transition - update the label
                transition.transition()
                    .duration(aniOptions.graphOpt.duration * 1000)
                    .ease('cubic-out')
                    .attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(currentPoint.y) + ')')
                    .each('end', function () {
                        callback(aniOptions);
                    })
                    .select('text').tween('text', updateTextY(currentPoint));
            }
        }
    }

    function setup(aniOptions, selector) {
        //sugar
        var optsIn = aniOptions.graphOpt,
            graphOptions = {
                target: selector,
                data: [{
                    fn: optsIn.equation,
                    skipTip: true
                }],
                xAxis: {
                    domain: [optsIn.view.x.min, optsIn.view.x.max]
                },
                yAxis: {
                    domain: [optsIn.view.y.min, optsIn.view.y.max]
                },
                disableZoom: true,
                grid: true,
				annotations: [{
					x: 0,
					text: 'y axis'
				}, {
					y: 0,
					text: 'x axis'
				}]
            };

        //save some things for later
        graphLocationSelector = selector;
        dotLocation = graphLocationSelector + ' .content';
        currentEquation = optsIn.equation;

        //make the plot and scales
        funPlot = functionPlot(graphOptions);
        xScale = funPlot.meta.xScale;
        yScale = funPlot.meta.yScale;

        //clean out any old points first
        d3.selectAll(dotLocation + ' .point').remove();
    }

    return {
        update: update,
        setup: setup
    };
}());

$(document).ready(function () {

    /*
    Load Query substring
    */

    if (location.search == "") {
            //Default query string if nothing provided
        var queryVars = [];
        queryVars.push("file=funcMachineSettings");
    }
    else{
        // Grab the query string and options
        var queryVars = [];
            var queryString = location.search.substring(1);
        // Set queryVars to be array of parameters
        queryVars = queryString.split("&");

    }
    var allQueries = {};

    queryVars.forEach(function (query){
        var pair = query.split("=");
        allQueries[pair[0]] = pair[1];
    })

//    for (var i = 0; i < queryVars.length; i++) {
//        var pair = queryVars[i].split("=");
//        allQueries[pair[0]] = pair[1];
//    }
console.log(queryVars);
    function showProfOptions(profOpt, init) {
        /*
        Append the professor's chosen equations to the application
        */

        var stringifiedData = JSON.stringify(init),
            opt = $("<option></option>").append(profOpt.name);

        $(opt)
            .val(profOpt.equation)
            .attr("data-profOpt", stringifiedData);

        $("select")
            .append(opt);
    }

    /*
    Load the professor configuration file

    general query: ?file=funcMachineSettings&load=general
    */

    $.getJSON(allQueries.file + ".json", function (data) {

        var result;
        // If there is a "load" query, load it, otherwise load the general option.
        if (allQueries.load) {
            result = data[allQueries.load];
        } else {
            result = data.general;
        }

        $("#title").html(result.title);
        $("#instructionText").html(result.instructions);

        window.professorConfigFile = result.equations;

        $.each(result.equations, function (i, profOpt) {

            var init = {
                graphOpt: profOpt
            };

            showProfOptions(profOpt, init);

            /*
            Display the default equation to the function machine
            */
            if (i === 0) {
                //in events.js
                plotGraph.setup(init, "#graph");

                document.querySelector(".graph").firstChild.style.display = "none";

                /*Checkbox onclick event*/
                $("input#showGraph[type='checkbox']").click(e => {
                    var checked = e.target.checked;
                    if (checked) {
                        document.querySelector(".graph").firstChild.style.display = "block";
                    } else {
                        document.querySelector(".graph").firstChild.style.display = "none";
                    }
                })

                changePlot(profOpt.equation);
            }
        });

    }).fail(function () {
        $("#status p").append("Add a query string")
    });

});

var equPara = $("#functionMachine #equ")[0],
    rangeSpeed = $("#animate").val(),
    aniDuration = (1 * 5) / rangeSpeed;

$('#animate').change(e => {
    aniDuration = (1 * 5) / e.target.value;
})

function runAnimation(name, value) {
    /*
    This is a function factory which will grab the
    necessary data and then return the function promise
    */
    return function animation(aniSettings) {
        "use strict";
        var datapoint = aniSettings.datapoints[aniSettings.currentRound],
            numPara = datapoint.element;

        /*
        Make the promise that when the dynamic
        animation path is done then this promise is finished
        */
        return new Promise(function (resolve) {
            $(numPara)
                .html(value)
                .css({
                    "animation": `${name}${aniSettings.currentRound} ${aniDuration}s ease-in-out`,
                })
                .one('animationend', function (e) {
                    resolve(aniSettings);
                });
        });
    };
}

function statusMessage(message) {
    "use strict";
    /*
    This is a function factory which will grab the
    necessary data and then return the function promise
    */
    var statusBar = $("#status p");

    statusBar
        .html('')
        .css({
            "fontWeight": "normal",
            "color": "black"
        });

    return function (aniSettings) {
        return new Promise(function (resolve) {
            statusBar.html(message);
            resolve(aniSettings);
        });

    };
}

function replaceXEqu(aniSettings) {
    "use strict";

    /*
    Replace the x in the disappeared equation without having the y disappear.
    */
    return new Promise(function (resolve) {
        if (aniSettings.graphOpt.hideEquation) {
            resolve(aniSettings);
        } else {
            $(equPara)
                .css("animation", `textDisappear ${aniDuration*0.5}s ease-in-out`)
                .one("animationend", function (e) {
                    $(equPara).css("opacity", 0);
                    resolve(aniSettings);
                });
        }
    });
}

function showEvaluateEqu(aniSettings) {
    "use strict";

    /*
    Get the y answer and the x-changed equation
    */
    var pointData = aniSettings.datapoints[aniSettings.currentRound],
        changeEqu = pointData.changeEqu;

    /*
    Show the new equation with the replaced x-value equation
    */
    return new Promise(function (resolve) {
        if (aniSettings.graphOpt.hideEquation) {
            resolve(aniSettings);
        } else {
            katex.render(`${changeEqu}`, equPara);
            $(equPara)
                .css("animation", `textAppear ${aniDuration*0.5}s ease-in-out`)
                .one("animationend", function (e) {
                    $(equPara).css("opacity", 1);
                    resolve(aniSettings);
                })
        }
    });
}

function showYAns(aniSettings) {
    "use strict";

    /*
    Get the current round and current data points
    */
    var pointData = aniSettings.datapoints[aniSettings.currentRound];

    /*
    Animate the new y value to the coordinated y column and once
    animation is done then return the promise
    */
    return new Promise(function (resolve) {
        if (aniSettings.graphOpt.hideEquation) {
            resolve(aniSettings);
        } else {
            $(equPara)
                .css("animation", `textDisappear ${aniDuration*0.5}s ease-in-out`)
                .one("animationend", function () {
                    $(equPara).css("opacity", 0);
                    katex.render(`${pointData.y}`, equPara);
                    resolve(aniSettings);
                });
        }
    });
}

/*
Show the chosen equation to graph
*/
function showEquationAgain(aniSettings) {
    return new Promise(function (resolve) {
        if (aniSettings.graphOpt.hideEquation) {
            resolve(aniSettings);
        } else {
            $(equPara)
                .css("animation", `textAppear ${aniDuration*0.5}s ease-in-out`)
                .one("animationend", function (e) {
                    $(equPara).css("opacity", 1);
                    resolve(aniSettings);
                });
        }
    });
}

/*
Once the y-value appears in the correct y-column then fulfill the promise.
*/
function placeYValue(aniSettings) {
    "use strict";
    var pointData = aniSettings.datapoints[aniSettings.currentRound];
    return new Promise(function (resolve) {
        var input = $(`td#yval${pointData.id + 1}`)[0];
        $(input).html("");
        $(input).append(`<p>${pointData.y}</p>`);
        resolve(aniSettings);
    });
}

/*
Once the equation is cleared and reset to the default equation
then fulfill the promise
*/
function resetRound(aniSettings) {
    "use strict";

    //    var pointData = aniSettings.datapoints[aniSettings.currentRound];

    return new Promise(function (resolve) {
        if (aniSettings.graphOpt.hideEquation) {
            resolve(aniSettings);
        } else {
            $(equPara)
                .css("animation", `textDisappear ${aniDuration*0.15}s ease-in-out`)
                .one("animationend", function (e) {
                    $(equPara).css("opacity", 0);
                    katex.render(`${profOpt.latex}`, equPara);
                    resolve(aniSettings);
                });
        }
    });
}

/*
Return to default beginning equation for the next animation or for the end
*/
function showDefaultEqu(aniSettings) {
    return new Promise(function (resolve) {
        if (aniSettings.graphOpt.hideEquation) {
            resolve(aniSettings);
        } else {
            $(equPara)
                .css("animation", `textAppear ${aniDuration*0.15}s ease-in-out`)
                .one("animationend", function (e) {
                    $(equPara).css("opacity", 1);
                    resolve(aniSettings);
                });
        }
    });
}

/*
Accept the datapoint and its iterator and plot that point being passed through
*/
function plotter(aniSettings) {
    "use strict";
    return new Promise(function (resolve) {
        plotGraph.update(aniSettings, function () {
            resolve(aniSettings);
        });
    });
}

/*
This function acts as an iterator so that the promise chain knows which
datapoint to handle and to animate
*/
function updateRound(aniSettings) {
    "use strict";

    var placeholder = aniSettings.datapoints[aniSettings.currentRound];

    return new Promise(function (resolve) {
        aniSettings.currentRound += 1;
        placeholder.updatePoint = false;

        resolve(aniSettings);
    });
};

/*
Two functions in order to replace the function machine gif with the animated
gif and backwards.
*/
function animateFuncMachine(aniSettings) {
    return new Promise(function (resolve) {
        $("#functionMachine").css({
            "background-image": "url(./img/functionMachineAni.gif)"
        })
        resolve(aniSettings)
    });
}

function stopAniFuncMachine(aniSettings) {
    return new Promise(function (resolve) {
        $("#functionMachine").css({
            "background-image": "url(./img/functionMachineStill.gif)"
        })
        resolve(aniSettings)
    });
}

/*
A function to show the y answer leaving the function machine to
start the next animation of going back to the y column.
*/
function miniAni(aniSettings) {
    return new Promise(function (resolve) {

        var placeholder = aniSettings.datapoints[aniSettings.currentRound],
            yvalue = placeholder.y,
            para = $(`<p>${yvalue}</p>`);

        $(para).css({
            "fontSize": "20px"
        })

        $("body").append(para);

        para
            .css({
                position: "absolute",
                opacity: 0,
                left: 630,
                top: 160
            })
            .animate({
                opacity: 1,
                top: 200
            }, function (e) {
                para.css({
                    display: "none"
                });
                resolve(aniSettings);
            });
    });
}

/*
A promise chain to run through the whole animation process

NOTE
A promise chain has been utiziled in order to easily plugin
extra functions that would be great to have in the animation
process.  A promise chain has also been used in order to wait
for a animation to end to start the next animation.
*/

/*
Default Promise Chain
*/
function aniPromiseChain(dps, chain) {

    dps.datapoints.forEach(function (datapoint) {
        if (datapoint.updatePoint === true) {
            chain = chain
                .then(runAnimation("xToMachine", datapoint.x))
                .then(animateFuncMachine)
                .then(statusMessage("Calculating"))
                .then(replaceXEqu)
                .then(showEvaluateEqu)
                .then(showYAns)
                .then(showEquationAgain)
                .then(stopAniFuncMachine)
                .then(statusMessage(""))
                .then(miniAni)
                .then(runAnimation("machineToY", datapoint.y))
                .then(placeYValue)
                .then(runAnimation("yToStatusBar", `(${datapoint.x},${datapoint.y})`))
                .then(statusMessage(`Plotting (${datapoint.x},${datapoint.y})`))
                .then(plotter)
                .then(statusMessage(``))
                .then(resetRound)
                .then(showDefaultEqu);
        }
        chain = chain.then(updateRound);
    });
}

/*
If the "Hide Animation" checkbox is checked then skip the whole animation
promise chain and just append the y values
*/
function animateHide(dps, chain) {

    dps.datapoints.forEach(function (datapoint) {
        if (datapoint.updatePoint === true) {
            chain = chain
                .then(placeYValue)
                .then(statusMessage(`Plotting (${datapoint.x},${datapoint.y})`))
                .then(plotter);
        }
        chain = chain.then(updateRound);
    });
}

/*
Handle all CSS animations by creating a Promise chain through a for loop.
*/
function animatorControl(dps) {
    "use strict";

    var numContainer = $("#numContainer"),
        chain = Promise.resolve(dps);

    numContainer.innerHTML = "";

    if (aniDuration === 0.5) {
        animateHide(dps, chain);
    } else {
        aniPromiseChain(dps, chain);
    }

}

/*
Set up the basic variables.
*/
var xMemory = [],
    inputs = document.querySelectorAll("input[type='number']"),
    inputCount = inputs.length,
    runMaster = true,
    run = true;

/*
Attach an oninput event to all the input boxes in order to validate them within the bounds
that the professor has chosen.  If the bounds are exceeded, then disable the "Go!" button
and output a message to the status bar.
*/
for (var i = 0; i < inputs.length; i++) {

    inputs[i].onkeyup = e => {

        var xInputVal = e.srcElement.value;

        if (e.which === 69) {
            e.target.value = "";
            $("#status p").html(`Can't do that bro!`);
        }
    };
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
Dipslay Katex equation. ALSO used in ajax.js
*/
function changePlot(val) {

    xMemory = [];

    clearValues();

    window.profOpt = checkConfig(val);

    var equat = val,
        equPara = $("#functionMachine #equ")[0];

    $(equPara).empty();

    if (window.profOpt.hideEquation === false) {
        katex.render(window.profOpt.latex, equPara);
    } else if (window.profOpt.hideEquation === true) {
        $(equPara)
            .append("<h2>Mystery Equation</h2>")
            .css({
                "paddingTop": "5px",
            });
    }
}

/*
Animation path for the stairstep
*/
function stairStep(options) {
    "use strict";
    var highwayPath = 280,
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
        startTopOff: inputCords.top + 10,
        startLeftOff: inputCords.left + 30,
        endTopOff: 150,
        endLeftOff: 450,
        name: `xToMachine${index}`
    });
}

function makeMachineToY(inputCords, index) {
    "use strict";
    stairStep({
        startTopOff: 200,
        startLeftOff: 630,
        endTopOff: inputCords.top + 10,
        endLeftOff: inputCords.right + 5,
        name: `machineToY${index}`
    });
}

function makeYToStatusBar(inputCords, index) {
    "use strict";
    stairStep({
        startTopOff: inputCords.top + 5,
        startLeftOff: inputCords.right + 10,
        endTopOff: 50,
        endLeftOff: 400,
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

function UserException(message, errorNum) {
    this.message = message;
    this.errorNum = errorNum;
    this.name = "UserException";
}

/*
Set up the object that will be passed through the promise chain
in animator control.
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

                var replaceX = graphOpt.equation.replace(/x/g, `(${roundit})`),
                    yval = math.eval(replaceX);

                if (typeof yval === "number") {
                    var inputCoor = this.getBoundingClientRect(),
                        point = {
                            x: roundit,
                            y: yval.toFixed(profOpt.rounding),
                            id: i,
                            changeEqu: profOpt.latex.replace("x", `(${roundit})`),
                            updatePoint: xMemory[i] !== roundit,
                            element: $("#numContainer p").get(i)
                        };
                } else {
                    throw new UserException("out of domain", xvalue);
                }

                if (Infinity === yval) {
                    throw new UserException("undefined value", xvalue);
                }

                /*
                Clear out the Ys when they don't equal each other and need to be updated
                */
                if (point.updatePoint) {
                    $(`td#yval${i + 1}`).html("");
                }

                /*Update the xmemory*/
                xMemory[i] = roundit;
                aniSettings.datapoints.push(point);
            } else {
                throw new UserException("out of window", xvalue);
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
        graphOpt = {
            equation: profOpt.equation,
            hideEquation: profOpt.hideEquation,
            view: profOpt.view,
            duration: aniDuration
        },
        aniSettings = {
            datapoints: [],
            currentRound: 0,
            graphOpt: graphOpt
        };

    try {
        setUpObject(xinputs, graphOpt, aniSettings);
        animatorControl(aniSettings);
    } catch (e) {
        xMemory = [];
        $("#status p")
            .html(`${e.errorNum} x-value ${e.message}.`)
            .css({
                "fontWeight": "bold",
                "color": "#b62727"
            });
    }
}

/*Before running the function machine, put all inputs next to each other.*/
function cleanInputs() {
    var xinputs = $("input[type='number']"),
        inputArray = [];

    xinputs.each(function (i) {
        var inputValue = $(this).val();

        if (inputValue !== "") {
            inputArray.push(inputValue);
            $(this).val("");
        }
    })

    xinputs.each(function (i) {
        if (i < inputArray.length) {
            $(this).val(inputArray[i]);
        } else {
            $(this).val("");
        }
    })
}

$("#closeHelp").click(e => {
    $(e.target.parentElement).fadeOut(100);
    $("#shade").fadeOut(200);
    localStorage['firstTimeFunctionMachine'] = false;
});

$("#openHelp").click(e => {
    $("#instructions").fadeIn(100);
    $("#shade").fadeIn(1000);
});

$(document).ready(e => {
    try {
        var firsttime = localStorage['firstTimeFunctionMachine'];
    } catch (e) {
        console.error(e);
    }
    if (firsttime === "false") {
        $("#instructions").hide();
        $("#shade").hide();
    }
})

/*
Onchange event handler for the select html element.
*/
$("select").change(function (e) {
    var selected = $(`option[value="${e.target.value}"]`),
        profOpt = JSON.parse(selected.attr("data-profopt"));

    plotGraph.setup(profOpt, "#graph")
    changePlot(e.target.value);
});

/*
DOCUMENT keydown event handler
*/
$(document).keypress(function (e) {
    if (e.which == 13 && runMaster) {
        cleanInputs();
        startFuncMach();
    }
});

/*
GO! Click event handler
*/
$("input[type='button'][value='Go!']").click(function () {
    if (runMaster) {
        cleanInputs();
        startFuncMach();
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJwbG90R3JhcGguanMiLCJhamF4LmpzIiwiYW5pbWF0b3Jjb250cm9sLmpzIiwiZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKlxyXG4gICAgTWFrZSB0aGUgd2hvbGUgdGFibGUgYW5kIGNlbGxzIGZvciB0aGUgaW5wdXQgYm94ZXMgYW5kIHVzZXIgaW50ZXJhY3Rpb24uXHJcbiAgICAqL1xyXG4gICAgdmFyIHRib2R5ID0gJChcInRib2R5XCIpLFxyXG4gICAgICAgIHRkMSxcclxuICAgICAgICB0ZDIsXHJcbiAgICAgICAgdHIsXHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgcm93Q291bnQgPSAxMDtcclxuXHJcbiAgICBmb3IgKHZhciBqID0gMTsgaiA8PSByb3dDb3VudDsgaisrKSB7XHJcbiAgICAgICAgaW5wdXQgPSAkKFwiPGlucHV0PlwiKTtcclxuICAgICAgICB0ZDEgPSAkKFwiPHRkPjwvdGQ+XCIpO1xyXG4gICAgICAgIHRkMiA9ICQoXCI8dGQ+PC90ZD5cIik7XHJcbiAgICAgICAgdHIgPSAkKFwiPHRyPjwvdHI+XCIpO1xyXG5cclxuICAgICAgICAkKHRyKS5hdHRyKFwiaWRcIiwgYHJvdyR7an1gKTtcclxuXHJcbiAgICAgICAgJChpbnB1dCkuYXR0cihcIm5hbWVcIiwgYGlucHV0JHtqfWApLmF0dHIoXCJ0eXBlXCIsIFwibnVtYmVyXCIpO1xyXG5cclxuICAgICAgICAkKHRkMikuYXR0cihcImlkXCIsIGB5dmFsJHtqfWApO1xyXG5cclxuICAgICAgICAkKHRkMSkuYXBwZW5kKGlucHV0KTtcclxuICAgICAgICAkKHRyKS5hcHBlbmQodGQxKS5hcHBlbmQodGQyKTtcclxuICAgICAgICAkKHRib2R5KS5hcHBlbmQodHIpO1xyXG4gICAgfVxyXG59KCkpO1xyXG4iLCIvKmpzbGludCBwbHVzcGx1czogdHJ1ZSwgYnJvd3NlcjogdHJ1ZSwgZGV2ZWw6IHRydWUqL1xyXG4vKmdsb2JhbCBkMywgZnVuY3Rpb25QbG90Ki9cclxudmFyIHBsb3RHcmFwaCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBncmFwaExvY2F0aW9uU2VsZWN0b3IsXHJcbiAgICAgICAgZG90TG9jYXRpb24sXHJcbiAgICAgICAgY3VycmVudEVxdWF0aW9uLFxyXG4gICAgICAgIGZ1blBsb3QsXHJcbiAgICAgICAgeFNjYWxlLFxyXG4gICAgICAgIHlTY2FsZSxcclxuICAgICAgICBmcmVlSWQgPSAwO1xyXG5cclxuICAgIC8vdGhlc2UgdHdvIGZ1bmN0aW9ucyBtYWtlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCBpbiB0aGUgYW5pbWF0aW9ucyBmb3IgdGhlIHBvaW50IGxhYmVsc1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlVGV4dFgoY3VycmVudFBvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHZhciB6ZXJvID0gKDApLnRvRml4ZWQoMik7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGN1cnJlbnRQb2ludC54ICogdDtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dENvbnRlbnQgPSBcIiggXCIgKyBsb2NhdGlvbi50b0ZpeGVkKDIpICsgXCIsIFwiICsgemVybyArIFwiKVwiO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlVGV4dFkoY3VycmVudFBvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB4Um91bmRlZCA9IGN1cnJlbnRQb2ludC54LFxyXG4gICAgICAgICAgICAgICAgeVZhbCA9IGN1cnJlbnRQb2ludC55O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRDb250ZW50ID0gXCIoIFwiICsgeFJvdW5kZWQgKyBcIiwgXCIgKyAoeVZhbCAqIHQpLnRvRml4ZWQoMikgKyBcIilcIjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1ha2VQb2ludElkKG51bUluKSB7XHJcbiAgICAgICAgcmV0dXJuICdncmFwaFBvaW50JyArIG51bUluO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1ha2VQb2ludEdyb3VwKGN1cnJlbnRQb2ludCkge1xyXG4gICAgICAgIHZhciBwb2ludEdyb3VwID0gZDMuc2VsZWN0QWxsKGRvdExvY2F0aW9uKS5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAncG9pbnQnKVxyXG4gICAgICAgICAgICAuYXR0cignaWQnLCBtYWtlUG9pbnRJZChjdXJyZW50UG9pbnQuaWQpKTtcclxuXHJcbiAgICAgICAgLy9hZGQgdGhlIGNpcmNsZVxyXG4gICAgICAgIHBvaW50R3JvdXAuYXBwZW5kKCdjaXJjbGUnKVxyXG4gICAgICAgICAgICAuYXR0cigncicsIDQpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjeCcsIDApXHJcbiAgICAgICAgICAgIC5hdHRyKCdjeScsIDApO1xyXG5cclxuICAgICAgICAvL2FkZCB0aGUgbGFiZWxcclxuICAgICAgICBwb2ludEdyb3VwLmFwcGVuZCgndGV4dCcpXHJcbiAgICAgICAgICAgIC50ZXh0KCcoMCwgMCknKVxyXG4gICAgICAgICAgICAuYXR0cigneCcsIDUpXHJcbiAgICAgICAgICAgIC5hdHRyKCd5JywgMTUpO1xyXG4gICAgICAgIC8vbW92ZSBpdCB0byAoMCwwKVxyXG4gICAgICAgIHBvaW50R3JvdXAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeFNjYWxlKDApICsgJyAnICsgeVNjYWxlKDApICsgJyknKTtcclxuICAgICAgICByZXR1cm4gcG9pbnRHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGUoYW5pT3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgY3VycmVudFBvaW50ID0gYW5pT3B0aW9ucy5kYXRhcG9pbnRzW2FuaU9wdGlvbnMuY3VycmVudFJvdW5kXSxcclxuICAgICAgICAgICAgbGluZUlzUGxvdHRlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZG90TG9jYXRpb24gKyAnIC5ncmFwaCAubGluZScpLmxlbmd0aCA+IDAsXHJcbiAgICAgICAgICAgIHBvaW50R3JvdXAsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb247XHJcblxyXG4gICAgICAgIC8vY2xlYXIgYW55IHBvaW50cyB0aGF0IHdpbGwgZ2V0IHVwZGF0ZWRcclxuICAgICAgICBhbmlPcHRpb25zLmRhdGFwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAocG9pbnQpIHtcclxuICAgICAgICAgICAgaWYgKHBvaW50LnVwZGF0ZVBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3QoJyMnICsgbWFrZVBvaW50SWQocG9pbnQuaWQpKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL2NoZWNrIGlmIHdlIG5lZWQgdG8gaGlkZSBvciBzaG93IHRoZSBwbG90bGluZVxyXG4gICAgICAgIGlmIChhbmlPcHRpb25zLmdyYXBoT3B0LmdyYXBoSGlkZSkge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QoZG90TG9jYXRpb24gKyAnIC5ncmFwaCAubGluZScpLmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGQzLnNlbGVjdChkb3RMb2NhdGlvbiArICcgLmdyYXBoIC5saW5lJykuYXR0cignZGlzcGxheScsICdpbmxpbmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vZG9lcyB0aGUgY3VycmVudFJvdW5kIG5lZWQgdG8gYmUgdXBkYXRlZGVkP1xyXG4gICAgICAgIGlmICghY3VycmVudFBvaW50LnVwZGF0ZVBvaW50KSB7XHJcbiAgICAgICAgICAgIC8vbm90aGl0bmcgdG8gc2VlIGhlcmUganVzdCBrZWVwIG9uIG1vdmluZ1xyXG4gICAgICAgICAgICBjYWxsYmFjayhhbmlPcHRpb25zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2RyYXcgcG9pbnRcclxuICAgICAgICAgICAgcG9pbnRHcm91cCA9IG1ha2VQb2ludEdyb3VwKGN1cnJlbnRQb2ludCk7XHJcblxyXG4gICAgICAgICAgICAvL2lzIGFuaW1hdGlvbiBvbj9cclxuICAgICAgICAgICAgaWYgKGFuaU9wdGlvbnMuZ3JhcGhPcHQuZHVyYXRpb24gPD0gMC41KSB7XHJcbiAgICAgICAgICAgICAgICAvL21vdmUgaXQgaW50byBwbGFjZSB3aXRob3V0IGFuaW1hdGlvblxyXG4gICAgICAgICAgICAgICAgcG9pbnRHcm91cC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4U2NhbGUoY3VycmVudFBvaW50LngpICsgJyAnICsgeVNjYWxlKGN1cnJlbnRQb2ludC55KSArICcpJyk7XHJcbiAgICAgICAgICAgICAgICAvL3VwZGF0ZSB0aGUgbGFibGVcclxuICAgICAgICAgICAgICAgIHBvaW50R3JvdXAuc2VsZWN0KCd0ZXh0JykudGV4dCgnKCcgKyBjdXJyZW50UG9pbnQueCArICcsICcgKyBjdXJyZW50UG9pbnQueSArICcpJyk7XHJcbiAgICAgICAgICAgICAgICAvL2NhbGwgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGFuaU9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vZHJhdyBwb2ludCB3aXRoIGFuaW1haW9uXHJcbiAgICAgICAgICAgICAgICAvL0ZpcnN0IHRyYW5zaXRpb24gLSBtb3ZlIHRoZSBncm91cCBpbiB0aGUgWFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHBvaW50R3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKGFuaU9wdGlvbnMuZ3JhcGhPcHQuZHVyYXRpb24gKiAxMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5lYXNlKCdjdWJpYy1vdXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4U2NhbGUoY3VycmVudFBvaW50LngpICsgJyAnICsgeVNjYWxlKDApICsgJyknKTtcclxuICAgICAgICAgICAgICAgIC8vc3ViIHRyYW5zaXRpb24gLSB1cGRhdGUgdGhlIGxhYmVsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLnNlbGVjdCgndGV4dCcpLnR3ZWVuKCd0ZXh0JywgdXBkYXRlVGV4dFgoY3VycmVudFBvaW50KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9TZWNvbmQgdHJhbnNpdGlvbiAtIG1vdmUgdGhlIGdyb3VwIGluIHRoZSBZXHJcbiAgICAgICAgICAgICAgICAvL3N1YiB0cmFuc2l0aW9uIC0gdXBkYXRlIHRoZSBsYWJlbFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi50cmFuc2l0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oYW5pT3B0aW9ucy5ncmFwaE9wdC5kdXJhdGlvbiAqIDEwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgLmVhc2UoJ2N1YmljLW91dCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhTY2FsZShjdXJyZW50UG9pbnQueCkgKyAnICcgKyB5U2NhbGUoY3VycmVudFBvaW50LnkpICsgJyknKVxyXG4gICAgICAgICAgICAgICAgICAgIC5lYWNoKCdlbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGFuaU9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLnNlbGVjdCgndGV4dCcpLnR3ZWVuKCd0ZXh0JywgdXBkYXRlVGV4dFkoY3VycmVudFBvaW50KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0dXAoYW5pT3B0aW9ucywgc2VsZWN0b3IpIHtcclxuICAgICAgICAvL3N1Z2FyXHJcbiAgICAgICAgdmFyIG9wdHNJbiA9IGFuaU9wdGlvbnMuZ3JhcGhPcHQsXHJcbiAgICAgICAgICAgIGdyYXBoT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogc2VsZWN0b3IsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbe1xyXG4gICAgICAgICAgICAgICAgICAgIGZuOiBvcHRzSW4uZXF1YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgc2tpcFRpcDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbjogW29wdHNJbi52aWV3LngubWluLCBvcHRzSW4udmlldy54Lm1heF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbjogW29wdHNJbi52aWV3LnkubWluLCBvcHRzSW4udmlldy55Lm1heF1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlWm9vbTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGdyaWQ6IHRydWUsXHJcblx0XHRcdFx0YW5ub3RhdGlvbnM6IFt7XHJcblx0XHRcdFx0XHR4OiAwLFxyXG5cdFx0XHRcdFx0dGV4dDogJ3kgYXhpcydcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHR5OiAwLFxyXG5cdFx0XHRcdFx0dGV4dDogJ3ggYXhpcydcclxuXHRcdFx0XHR9XVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL3NhdmUgc29tZSB0aGluZ3MgZm9yIGxhdGVyXHJcbiAgICAgICAgZ3JhcGhMb2NhdGlvblNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgZG90TG9jYXRpb24gPSBncmFwaExvY2F0aW9uU2VsZWN0b3IgKyAnIC5jb250ZW50JztcclxuICAgICAgICBjdXJyZW50RXF1YXRpb24gPSBvcHRzSW4uZXF1YXRpb247XHJcblxyXG4gICAgICAgIC8vbWFrZSB0aGUgcGxvdCBhbmQgc2NhbGVzXHJcbiAgICAgICAgZnVuUGxvdCA9IGZ1bmN0aW9uUGxvdChncmFwaE9wdGlvbnMpO1xyXG4gICAgICAgIHhTY2FsZSA9IGZ1blBsb3QubWV0YS54U2NhbGU7XHJcbiAgICAgICAgeVNjYWxlID0gZnVuUGxvdC5tZXRhLnlTY2FsZTtcclxuXHJcbiAgICAgICAgLy9jbGVhbiBvdXQgYW55IG9sZCBwb2ludHMgZmlyc3RcclxuICAgICAgICBkMy5zZWxlY3RBbGwoZG90TG9jYXRpb24gKyAnIC5wb2ludCcpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdXBkYXRlOiB1cGRhdGUsXHJcbiAgICAgICAgc2V0dXA6IHNldHVwXHJcbiAgICB9O1xyXG59KCkpO1xyXG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgLypcclxuICAgIExvYWQgUXVlcnkgc3Vic3RyaW5nXHJcbiAgICAqL1xyXG5cclxuICAgIGlmIChsb2NhdGlvbi5zZWFyY2ggPT0gXCJcIikge1xyXG4gICAgICAgICAgICAvL0RlZmF1bHQgcXVlcnkgc3RyaW5nIGlmIG5vdGhpbmcgcHJvdmlkZWRcclxuICAgICAgICB2YXIgcXVlcnlWYXJzID0gW107XHJcbiAgICAgICAgcXVlcnlWYXJzLnB1c2goXCJmaWxlPWZ1bmNNYWNoaW5lU2V0dGluZ3NcIik7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIC8vIEdyYWIgdGhlIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uc1xyXG4gICAgICAgIHZhciBxdWVyeVZhcnMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gbG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcclxuICAgICAgICAvLyBTZXQgcXVlcnlWYXJzIHRvIGJlIGFycmF5IG9mIHBhcmFtZXRlcnNcclxuICAgICAgICBxdWVyeVZhcnMgPSBxdWVyeVN0cmluZy5zcGxpdChcIiZcIik7XHJcblxuICAgIH1cclxuICAgIHZhciBhbGxRdWVyaWVzID0ge307XHJcblxyXG4gICAgcXVlcnlWYXJzLmZvckVhY2goZnVuY3Rpb24gKHF1ZXJ5KXtcclxuICAgICAgICB2YXIgcGFpciA9IHF1ZXJ5LnNwbGl0KFwiPVwiKTtcclxuICAgICAgICBhbGxRdWVyaWVzW3BhaXJbMF1dID0gcGFpclsxXTtcclxuICAgIH0pXHJcblxyXG4vLyAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXJ5VmFycy5sZW5ndGg7IGkrKykge1xyXG4vLyAgICAgICAgdmFyIHBhaXIgPSBxdWVyeVZhcnNbaV0uc3BsaXQoXCI9XCIpO1xyXG4vLyAgICAgICAgYWxsUXVlcmllc1twYWlyWzBdXSA9IHBhaXJbMV07XHJcbi8vICAgIH1cclxuY29uc29sZS5sb2cocXVlcnlWYXJzKTtcclxuICAgIGZ1bmN0aW9uIHNob3dQcm9mT3B0aW9ucyhwcm9mT3B0LCBpbml0KSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICBBcHBlbmQgdGhlIHByb2Zlc3NvcidzIGNob3NlbiBlcXVhdGlvbnMgdG8gdGhlIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgdmFyIHN0cmluZ2lmaWVkRGF0YSA9IEpTT04uc3RyaW5naWZ5KGluaXQpLFxyXG4gICAgICAgICAgICBvcHQgPSAkKFwiPG9wdGlvbj48L29wdGlvbj5cIikuYXBwZW5kKHByb2ZPcHQubmFtZSk7XHJcblxyXG4gICAgICAgICQob3B0KVxyXG4gICAgICAgICAgICAudmFsKHByb2ZPcHQuZXF1YXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZGF0YS1wcm9mT3B0XCIsIHN0cmluZ2lmaWVkRGF0YSk7XHJcblxyXG4gICAgICAgICQoXCJzZWxlY3RcIilcclxuICAgICAgICAgICAgLmFwcGVuZChvcHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBMb2FkIHRoZSBwcm9mZXNzb3IgY29uZmlndXJhdGlvbiBmaWxlXHJcblxyXG4gICAgZ2VuZXJhbCBxdWVyeTogP2ZpbGU9ZnVuY01hY2hpbmVTZXR0aW5ncyZsb2FkPWdlbmVyYWxcclxuICAgICovXHJcblxyXG4gICAgJC5nZXRKU09OKGFsbFF1ZXJpZXMuZmlsZSArIFwiLmpzb25cIiwgZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIFwibG9hZFwiIHF1ZXJ5LCBsb2FkIGl0LCBvdGhlcndpc2UgbG9hZCB0aGUgZ2VuZXJhbCBvcHRpb24uXHJcbiAgICAgICAgaWYgKGFsbFF1ZXJpZXMubG9hZCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBkYXRhW2FsbFF1ZXJpZXMubG9hZF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gZGF0YS5nZW5lcmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiN0aXRsZVwiKS5odG1sKHJlc3VsdC50aXRsZSk7XHJcbiAgICAgICAgJChcIiNpbnN0cnVjdGlvblRleHRcIikuaHRtbChyZXN1bHQuaW5zdHJ1Y3Rpb25zKTtcclxuXHJcbiAgICAgICAgd2luZG93LnByb2Zlc3NvckNvbmZpZ0ZpbGUgPSByZXN1bHQuZXF1YXRpb25zO1xyXG5cclxuICAgICAgICAkLmVhY2gocmVzdWx0LmVxdWF0aW9ucywgZnVuY3Rpb24gKGksIHByb2ZPcHQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbml0ID0ge1xyXG4gICAgICAgICAgICAgICAgZ3JhcGhPcHQ6IHByb2ZPcHRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNob3dQcm9mT3B0aW9ucyhwcm9mT3B0LCBpbml0KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIERpc3BsYXkgdGhlIGRlZmF1bHQgZXF1YXRpb24gdG8gdGhlIGZ1bmN0aW9uIG1hY2hpbmVcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vaW4gZXZlbnRzLmpzXHJcbiAgICAgICAgICAgICAgICBwbG90R3JhcGguc2V0dXAoaW5pdCwgXCIjZ3JhcGhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ncmFwaFwiKS5maXJzdENoaWxkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvKkNoZWNrYm94IG9uY2xpY2sgZXZlbnQqL1xyXG4gICAgICAgICAgICAgICAgJChcImlucHV0I3Nob3dHcmFwaFt0eXBlPSdjaGVja2JveCddXCIpLmNsaWNrKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkID0gZS50YXJnZXQuY2hlY2tlZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdyYXBoXCIpLmZpcnN0Q2hpbGQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdyYXBoXCIpLmZpcnN0Q2hpbGQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgY2hhbmdlUGxvdChwcm9mT3B0LmVxdWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pLmZhaWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjc3RhdHVzIHBcIikuYXBwZW5kKFwiQWRkIGEgcXVlcnkgc3RyaW5nXCIpXHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCJ2YXIgZXF1UGFyYSA9ICQoXCIjZnVuY3Rpb25NYWNoaW5lICNlcXVcIilbMF0sXHJcbiAgICByYW5nZVNwZWVkID0gJChcIiNhbmltYXRlXCIpLnZhbCgpLFxyXG4gICAgYW5pRHVyYXRpb24gPSAoMSAqIDUpIC8gcmFuZ2VTcGVlZDtcclxuXHJcbiQoJyNhbmltYXRlJykuY2hhbmdlKGUgPT4ge1xyXG4gICAgYW5pRHVyYXRpb24gPSAoMSAqIDUpIC8gZS50YXJnZXQudmFsdWU7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBydW5BbmltYXRpb24obmFtZSwgdmFsdWUpIHtcclxuICAgIC8qXHJcbiAgICBUaGlzIGlzIGEgZnVuY3Rpb24gZmFjdG9yeSB3aGljaCB3aWxsIGdyYWIgdGhlXHJcbiAgICBuZWNlc3NhcnkgZGF0YSBhbmQgdGhlbiByZXR1cm4gdGhlIGZ1bmN0aW9uIHByb21pc2VcclxuICAgICovXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gYW5pbWF0aW9uKGFuaVNldHRpbmdzKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdmFyIGRhdGFwb2ludCA9IGFuaVNldHRpbmdzLmRhdGFwb2ludHNbYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kXSxcclxuICAgICAgICAgICAgbnVtUGFyYSA9IGRhdGFwb2ludC5lbGVtZW50O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIE1ha2UgdGhlIHByb21pc2UgdGhhdCB3aGVuIHRoZSBkeW5hbWljXHJcbiAgICAgICAgYW5pbWF0aW9uIHBhdGggaXMgZG9uZSB0aGVuIHRoaXMgcHJvbWlzZSBpcyBmaW5pc2hlZFxyXG4gICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICQobnVtUGFyYSlcclxuICAgICAgICAgICAgICAgIC5odG1sKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbmltYXRpb25cIjogYCR7bmFtZX0ke2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZH0gJHthbmlEdXJhdGlvbn1zIGVhc2UtaW4tb3V0YCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub25lKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0dXNNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgLypcclxuICAgIFRoaXMgaXMgYSBmdW5jdGlvbiBmYWN0b3J5IHdoaWNoIHdpbGwgZ3JhYiB0aGVcclxuICAgIG5lY2Vzc2FyeSBkYXRhIGFuZCB0aGVuIHJldHVybiB0aGUgZnVuY3Rpb24gcHJvbWlzZVxyXG4gICAgKi9cclxuICAgIHZhciBzdGF0dXNCYXIgPSAkKFwiI3N0YXR1cyBwXCIpO1xyXG5cclxuICAgIHN0YXR1c0JhclxyXG4gICAgICAgIC5odG1sKCcnKVxyXG4gICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICBcImZvbnRXZWlnaHRcIjogXCJub3JtYWxcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFuaVNldHRpbmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0Jhci5odG1sKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXBsYWNlWEVxdShhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLypcclxuICAgIFJlcGxhY2UgdGhlIHggaW4gdGhlIGRpc2FwcGVhcmVkIGVxdWF0aW9uIHdpdGhvdXQgaGF2aW5nIHRoZSB5IGRpc2FwcGVhci5cclxuICAgICovXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICBpZiAoYW5pU2V0dGluZ3MuZ3JhcGhPcHQuaGlkZUVxdWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgICAgIC5jc3MoXCJhbmltYXRpb25cIiwgYHRleHREaXNhcHBlYXIgJHthbmlEdXJhdGlvbiowLjV9cyBlYXNlLWluLW91dGApXHJcbiAgICAgICAgICAgICAgICAub25lKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlcXVQYXJhKS5jc3MoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dFdmFsdWF0ZUVxdShhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLypcclxuICAgIEdldCB0aGUgeSBhbnN3ZXIgYW5kIHRoZSB4LWNoYW5nZWQgZXF1YXRpb25cclxuICAgICovXHJcbiAgICB2YXIgcG9pbnREYXRhID0gYW5pU2V0dGluZ3MuZGF0YXBvaW50c1thbmlTZXR0aW5ncy5jdXJyZW50Um91bmRdLFxyXG4gICAgICAgIGNoYW5nZUVxdSA9IHBvaW50RGF0YS5jaGFuZ2VFcXU7XHJcblxyXG4gICAgLypcclxuICAgIFNob3cgdGhlIG5ldyBlcXVhdGlvbiB3aXRoIHRoZSByZXBsYWNlZCB4LXZhbHVlIGVxdWF0aW9uXHJcbiAgICAqL1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgaWYgKGFuaVNldHRpbmdzLmdyYXBoT3B0LmhpZGVFcXVhdGlvbikge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBrYXRleC5yZW5kZXIoYCR7Y2hhbmdlRXF1fWAsIGVxdVBhcmEpO1xyXG4gICAgICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuY3NzKFwiYW5pbWF0aW9uXCIsIGB0ZXh0QXBwZWFyICR7YW5pRHVyYXRpb24qMC41fXMgZWFzZS1pbi1vdXRgKVxyXG4gICAgICAgICAgICAgICAgLm9uZShcImFuaW1hdGlvbmVuZFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dZQW5zKGFuaVNldHRpbmdzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKlxyXG4gICAgR2V0IHRoZSBjdXJyZW50IHJvdW5kIGFuZCBjdXJyZW50IGRhdGEgcG9pbnRzXHJcbiAgICAqL1xyXG4gICAgdmFyIHBvaW50RGF0YSA9IGFuaVNldHRpbmdzLmRhdGFwb2ludHNbYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kXTtcclxuXHJcbiAgICAvKlxyXG4gICAgQW5pbWF0ZSB0aGUgbmV3IHkgdmFsdWUgdG8gdGhlIGNvb3JkaW5hdGVkIHkgY29sdW1uIGFuZCBvbmNlXHJcbiAgICBhbmltYXRpb24gaXMgZG9uZSB0aGVuIHJldHVybiB0aGUgcHJvbWlzZVxyXG4gICAgKi9cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIGlmIChhbmlTZXR0aW5ncy5ncmFwaE9wdC5oaWRlRXF1YXRpb24pIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJChlcXVQYXJhKVxyXG4gICAgICAgICAgICAgICAgLmNzcyhcImFuaW1hdGlvblwiLCBgdGV4dERpc2FwcGVhciAke2FuaUR1cmF0aW9uKjAuNX1zIGVhc2UtaW4tb3V0YClcclxuICAgICAgICAgICAgICAgIC5vbmUoXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBrYXRleC5yZW5kZXIoYCR7cG9pbnREYXRhLnl9YCwgZXF1UGFyYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuU2hvdyB0aGUgY2hvc2VuIGVxdWF0aW9uIHRvIGdyYXBoXHJcbiovXHJcbmZ1bmN0aW9uIHNob3dFcXVhdGlvbkFnYWluKGFuaVNldHRpbmdzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICBpZiAoYW5pU2V0dGluZ3MuZ3JhcGhPcHQuaGlkZUVxdWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgICAgIC5jc3MoXCJhbmltYXRpb25cIiwgYHRleHRBcHBlYXIgJHthbmlEdXJhdGlvbiowLjV9cyBlYXNlLWluLW91dGApXHJcbiAgICAgICAgICAgICAgICAub25lKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlcXVQYXJhKS5jc3MoXCJvcGFjaXR5XCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbk9uY2UgdGhlIHktdmFsdWUgYXBwZWFycyBpbiB0aGUgY29ycmVjdCB5LWNvbHVtbiB0aGVuIGZ1bGZpbGwgdGhlIHByb21pc2UuXHJcbiovXHJcbmZ1bmN0aW9uIHBsYWNlWVZhbHVlKGFuaVNldHRpbmdzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwb2ludERhdGEgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICB2YXIgaW5wdXQgPSAkKGB0ZCN5dmFsJHtwb2ludERhdGEuaWQgKyAxfWApWzBdO1xyXG4gICAgICAgICQoaW5wdXQpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgJChpbnB1dCkuYXBwZW5kKGA8cD4ke3BvaW50RGF0YS55fTwvcD5gKTtcclxuICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5PbmNlIHRoZSBlcXVhdGlvbiBpcyBjbGVhcmVkIGFuZCByZXNldCB0byB0aGUgZGVmYXVsdCBlcXVhdGlvblxyXG50aGVuIGZ1bGZpbGwgdGhlIHByb21pc2VcclxuKi9cclxuZnVuY3Rpb24gcmVzZXRSb3VuZChhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gICAgdmFyIHBvaW50RGF0YSA9IGFuaVNldHRpbmdzLmRhdGFwb2ludHNbYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kXTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICBpZiAoYW5pU2V0dGluZ3MuZ3JhcGhPcHQuaGlkZUVxdWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgICAgIC5jc3MoXCJhbmltYXRpb25cIiwgYHRleHREaXNhcHBlYXIgJHthbmlEdXJhdGlvbiowLjE1fXMgZWFzZS1pbi1vdXRgKVxyXG4gICAgICAgICAgICAgICAgLm9uZShcImFuaW1hdGlvbmVuZFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBrYXRleC5yZW5kZXIoYCR7cHJvZk9wdC5sYXRleH1gLCBlcXVQYXJhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5SZXR1cm4gdG8gZGVmYXVsdCBiZWdpbm5pbmcgZXF1YXRpb24gZm9yIHRoZSBuZXh0IGFuaW1hdGlvbiBvciBmb3IgdGhlIGVuZFxyXG4qL1xyXG5mdW5jdGlvbiBzaG93RGVmYXVsdEVxdShhbmlTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgaWYgKGFuaVNldHRpbmdzLmdyYXBoT3B0LmhpZGVFcXVhdGlvbikge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuY3NzKFwiYW5pbWF0aW9uXCIsIGB0ZXh0QXBwZWFyICR7YW5pRHVyYXRpb24qMC4xNX1zIGVhc2UtaW4tb3V0YClcclxuICAgICAgICAgICAgICAgIC5vbmUoXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVxdVBhcmEpLmNzcyhcIm9wYWNpdHlcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuQWNjZXB0IHRoZSBkYXRhcG9pbnQgYW5kIGl0cyBpdGVyYXRvciBhbmQgcGxvdCB0aGF0IHBvaW50IGJlaW5nIHBhc3NlZCB0aHJvdWdoXHJcbiovXHJcbmZ1bmN0aW9uIHBsb3R0ZXIoYW5pU2V0dGluZ3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgcGxvdEdyYXBoLnVwZGF0ZShhbmlTZXR0aW5ncywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5UaGlzIGZ1bmN0aW9uIGFjdHMgYXMgYW4gaXRlcmF0b3Igc28gdGhhdCB0aGUgcHJvbWlzZSBjaGFpbiBrbm93cyB3aGljaFxyXG5kYXRhcG9pbnQgdG8gaGFuZGxlIGFuZCB0byBhbmltYXRlXHJcbiovXHJcbmZ1bmN0aW9uIHVwZGF0ZVJvdW5kKGFuaVNldHRpbmdzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgcGxhY2Vob2xkZXIgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF07XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kICs9IDE7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIudXBkYXRlUG9pbnQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qXHJcblR3byBmdW5jdGlvbnMgaW4gb3JkZXIgdG8gcmVwbGFjZSB0aGUgZnVuY3Rpb24gbWFjaGluZSBnaWYgd2l0aCB0aGUgYW5pbWF0ZWRcclxuZ2lmIGFuZCBiYWNrd2FyZHMuXHJcbiovXHJcbmZ1bmN0aW9uIGFuaW1hdGVGdW5jTWFjaGluZShhbmlTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgJChcIiNmdW5jdGlvbk1hY2hpbmVcIikuY3NzKHtcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWltYWdlXCI6IFwidXJsKC4vaW1nL2Z1bmN0aW9uTWFjaGluZUFuaS5naWYpXCJcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcEFuaUZ1bmNNYWNoaW5lKGFuaVNldHRpbmdzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICAkKFwiI2Z1bmN0aW9uTWFjaGluZVwiKS5jc3Moe1xyXG4gICAgICAgICAgICBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoLi9pbWcvZnVuY3Rpb25NYWNoaW5lU3RpbGwuZ2lmKVwiXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbkEgZnVuY3Rpb24gdG8gc2hvdyB0aGUgeSBhbnN3ZXIgbGVhdmluZyB0aGUgZnVuY3Rpb24gbWFjaGluZSB0b1xyXG5zdGFydCB0aGUgbmV4dCBhbmltYXRpb24gb2YgZ29pbmcgYmFjayB0byB0aGUgeSBjb2x1bW4uXHJcbiovXHJcbmZ1bmN0aW9uIG1pbmlBbmkoYW5pU2V0dGluZ3MpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG5cclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF0sXHJcbiAgICAgICAgICAgIHl2YWx1ZSA9IHBsYWNlaG9sZGVyLnksXHJcbiAgICAgICAgICAgIHBhcmEgPSAkKGA8cD4ke3l2YWx1ZX08L3A+YCk7XHJcblxyXG4gICAgICAgICQocGFyYSkuY3NzKHtcclxuICAgICAgICAgICAgXCJmb250U2l6ZVwiOiBcIjIwcHhcIlxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChwYXJhKTtcclxuXHJcbiAgICAgICAgcGFyYVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogNjMwLFxyXG4gICAgICAgICAgICAgICAgdG9wOiAxNjBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcclxuICAgICAgICAgICAgICAgIHRvcDogMjAwXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbkEgcHJvbWlzZSBjaGFpbiB0byBydW4gdGhyb3VnaCB0aGUgd2hvbGUgYW5pbWF0aW9uIHByb2Nlc3NcclxuXHJcbk5PVEVcclxuQSBwcm9taXNlIGNoYWluIGhhcyBiZWVuIHV0aXppbGVkIGluIG9yZGVyIHRvIGVhc2lseSBwbHVnaW5cclxuZXh0cmEgZnVuY3Rpb25zIHRoYXQgd291bGQgYmUgZ3JlYXQgdG8gaGF2ZSBpbiB0aGUgYW5pbWF0aW9uXHJcbnByb2Nlc3MuICBBIHByb21pc2UgY2hhaW4gaGFzIGFsc28gYmVlbiB1c2VkIGluIG9yZGVyIHRvIHdhaXRcclxuZm9yIGEgYW5pbWF0aW9uIHRvIGVuZCB0byBzdGFydCB0aGUgbmV4dCBhbmltYXRpb24uXHJcbiovXHJcblxyXG4vKlxyXG5EZWZhdWx0IFByb21pc2UgQ2hhaW5cclxuKi9cclxuZnVuY3Rpb24gYW5pUHJvbWlzZUNoYWluKGRwcywgY2hhaW4pIHtcclxuXHJcbiAgICBkcHMuZGF0YXBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhcG9pbnQpIHtcclxuICAgICAgICBpZiAoZGF0YXBvaW50LnVwZGF0ZVBvaW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNoYWluID0gY2hhaW5cclxuICAgICAgICAgICAgICAgIC50aGVuKHJ1bkFuaW1hdGlvbihcInhUb01hY2hpbmVcIiwgZGF0YXBvaW50LngpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oYW5pbWF0ZUZ1bmNNYWNoaW5lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShcIkNhbGN1bGF0aW5nXCIpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVwbGFjZVhFcXUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzaG93RXZhbHVhdGVFcXUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzaG93WUFucylcclxuICAgICAgICAgICAgICAgIC50aGVuKHNob3dFcXVhdGlvbkFnYWluKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RvcEFuaUZ1bmNNYWNoaW5lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShcIlwiKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKG1pbmlBbmkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihydW5BbmltYXRpb24oXCJtYWNoaW5lVG9ZXCIsIGRhdGFwb2ludC55KSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHBsYWNlWVZhbHVlKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocnVuQW5pbWF0aW9uKFwieVRvU3RhdHVzQmFyXCIsIGAoJHtkYXRhcG9pbnQueH0sJHtkYXRhcG9pbnQueX0pYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzdGF0dXNNZXNzYWdlKGBQbG90dGluZyAoJHtkYXRhcG9pbnQueH0sJHtkYXRhcG9pbnQueX0pYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihwbG90dGVyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShgYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNldFJvdW5kKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc2hvd0RlZmF1bHRFcXUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGFpbiA9IGNoYWluLnRoZW4odXBkYXRlUm91bmQpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbklmIHRoZSBcIkhpZGUgQW5pbWF0aW9uXCIgY2hlY2tib3ggaXMgY2hlY2tlZCB0aGVuIHNraXAgdGhlIHdob2xlIGFuaW1hdGlvblxyXG5wcm9taXNlIGNoYWluIGFuZCBqdXN0IGFwcGVuZCB0aGUgeSB2YWx1ZXNcclxuKi9cclxuZnVuY3Rpb24gYW5pbWF0ZUhpZGUoZHBzLCBjaGFpbikge1xyXG5cclxuICAgIGRwcy5kYXRhcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGRhdGFwb2ludCkge1xyXG4gICAgICAgIGlmIChkYXRhcG9pbnQudXBkYXRlUG9pbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgY2hhaW4gPSBjaGFpblxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocGxhY2VZVmFsdWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzdGF0dXNNZXNzYWdlKGBQbG90dGluZyAoJHtkYXRhcG9pbnQueH0sJHtkYXRhcG9pbnQueX0pYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihwbG90dGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhaW4gPSBjaGFpbi50aGVuKHVwZGF0ZVJvdW5kKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5IYW5kbGUgYWxsIENTUyBhbmltYXRpb25zIGJ5IGNyZWF0aW5nIGEgUHJvbWlzZSBjaGFpbiB0aHJvdWdoIGEgZm9yIGxvb3AuXHJcbiovXHJcbmZ1bmN0aW9uIGFuaW1hdG9yQ29udHJvbChkcHMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBudW1Db250YWluZXIgPSAkKFwiI251bUNvbnRhaW5lclwiKSxcclxuICAgICAgICBjaGFpbiA9IFByb21pc2UucmVzb2x2ZShkcHMpO1xyXG5cclxuICAgIG51bUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIGlmIChhbmlEdXJhdGlvbiA9PT0gMC41KSB7XHJcbiAgICAgICAgYW5pbWF0ZUhpZGUoZHBzLCBjaGFpbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFuaVByb21pc2VDaGFpbihkcHMsIGNoYWluKTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLypcclxuU2V0IHVwIHRoZSBiYXNpYyB2YXJpYWJsZXMuXHJcbiovXHJcbnZhciB4TWVtb3J5ID0gW10sXHJcbiAgICBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIiksXHJcbiAgICBpbnB1dENvdW50ID0gaW5wdXRzLmxlbmd0aCxcclxuICAgIHJ1bk1hc3RlciA9IHRydWUsXHJcbiAgICBydW4gPSB0cnVlO1xyXG5cclxuLypcclxuQXR0YWNoIGFuIG9uaW5wdXQgZXZlbnQgdG8gYWxsIHRoZSBpbnB1dCBib3hlcyBpbiBvcmRlciB0byB2YWxpZGF0ZSB0aGVtIHdpdGhpbiB0aGUgYm91bmRzXHJcbnRoYXQgdGhlIHByb2Zlc3NvciBoYXMgY2hvc2VuLiAgSWYgdGhlIGJvdW5kcyBhcmUgZXhjZWVkZWQsIHRoZW4gZGlzYWJsZSB0aGUgXCJHbyFcIiBidXR0b25cclxuYW5kIG91dHB1dCBhIG1lc3NhZ2UgdG8gdGhlIHN0YXR1cyBiYXIuXHJcbiovXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgaW5wdXRzW2ldLm9ua2V5dXAgPSBlID0+IHtcclxuXHJcbiAgICAgICAgdmFyIHhJbnB1dFZhbCA9IGUuc3JjRWxlbWVudC52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDY5KSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgJChcIiNzdGF0dXMgcFwiKS5odG1sKGBDYW4ndCBkbyB0aGF0IGJybyFgKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG4vKlxyXG5GdW5jdGlvbiB0byBzZWxlY3QgdGhlIGNob3NlbiBlcXVhdGlvbiB3aXRoIGl0cyBuYW1lIGFuZCBncmFwaCB3aW5kb3cgYm91bmRhcmllcy5cclxuKi9cclxuZnVuY3Rpb24gY2hlY2tDb25maWcodmFsKSB7XHJcbiAgICB2YXIgcHJvZk9wdDtcclxuICAgICQuZWFjaChwcm9mZXNzb3JDb25maWdGaWxlLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpdGVtLmVxdWF0aW9uID09PSB2YWwpIHtcclxuICAgICAgICAgICAgcHJvZk9wdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBwcm9mT3B0O1xyXG59XHJcblxyXG4vKlxyXG5VcG9uIGNob29zaW5nIGFub3RoZXIgZXF1YXRpb24gdG8gZ3JhcGgsIGNsZWFyIGFsbCB0aGUgdmFsdWVzXHJcbiovXHJcbmZ1bmN0aW9uIGNsZWFyVmFsdWVzKCkge1xyXG4gICAgdmFyIHhpbnB1dHMgPSAkKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIiksXHJcbiAgICAgICAgeWlucHV0cyA9ICQoYHRyIHRkOm50aC1vZi10eXBlKDIpYCk7XHJcblxyXG4gICAgeGlucHV0cy5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgaXRlbS52YWx1ZSA9IFwiXCI7XHJcbiAgICB9KTtcclxuXHJcbiAgICB5aW5wdXRzLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICBpdGVtLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuRGlwc2xheSBLYXRleCBlcXVhdGlvbi4gQUxTTyB1c2VkIGluIGFqYXguanNcclxuKi9cclxuZnVuY3Rpb24gY2hhbmdlUGxvdCh2YWwpIHtcclxuXHJcbiAgICB4TWVtb3J5ID0gW107XHJcblxyXG4gICAgY2xlYXJWYWx1ZXMoKTtcclxuXHJcbiAgICB3aW5kb3cucHJvZk9wdCA9IGNoZWNrQ29uZmlnKHZhbCk7XHJcblxyXG4gICAgdmFyIGVxdWF0ID0gdmFsLFxyXG4gICAgICAgIGVxdVBhcmEgPSAkKFwiI2Z1bmN0aW9uTWFjaGluZSAjZXF1XCIpWzBdO1xyXG5cclxuICAgICQoZXF1UGFyYSkuZW1wdHkoKTtcclxuXHJcbiAgICBpZiAod2luZG93LnByb2ZPcHQuaGlkZUVxdWF0aW9uID09PSBmYWxzZSkge1xyXG4gICAgICAgIGthdGV4LnJlbmRlcih3aW5kb3cucHJvZk9wdC5sYXRleCwgZXF1UGFyYSk7XHJcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5wcm9mT3B0LmhpZGVFcXVhdGlvbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgLmFwcGVuZChcIjxoMj5NeXN0ZXJ5IEVxdWF0aW9uPC9oMj5cIilcclxuICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcInBhZGRpbmdUb3BcIjogXCI1cHhcIixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbkFuaW1hdGlvbiBwYXRoIGZvciB0aGUgc3RhaXJzdGVwXHJcbiovXHJcbmZ1bmN0aW9uIHN0YWlyU3RlcChvcHRpb25zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBoaWdod2F5UGF0aCA9IDI4MCxcclxuICAgICAgICBsYXN0U2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGggLSAxXTtcclxuICAgIGxhc3RTaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7b3B0aW9ucy5uYW1lfSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwJSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7b3B0aW9ucy5zdGFydFRvcE9mZn1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke29wdGlvbnMuc3RhcnRMZWZ0T2ZmfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMTAlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMzMlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7b3B0aW9ucy5zdGFydFRvcE9mZn1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke2hpZ2h3YXlQYXRofXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNjYlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7b3B0aW9ucy5lbmRUb3BPZmZ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtoaWdod2F5UGF0aH1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDkwJSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEwMCUge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke29wdGlvbnMuZW5kVG9wT2ZmfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7b3B0aW9ucy5lbmRMZWZ0T2ZmfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9YCwgbGFzdFNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XHJcbn1cclxuXHJcbi8qXHJcbkEgc2V0IG9mIGZ1bmN0aW9ucyB1c2luZyB0aGUgc3RhaXJzdGVwIGFuaW1hdGlvbiB0ZW1wbGF0ZVxyXG50byBjcmVhdGUgcGF0aHdheXMgd2l0aCBjb29yZGluYXRlIGRhdGFcclxuKi9cclxuZnVuY3Rpb24gbWFrZVhUb01hY2hpbmUoaW5wdXRDb3JkcywgaW5kZXgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgc3RhaXJTdGVwKHtcclxuICAgICAgICBzdGFydFRvcE9mZjogaW5wdXRDb3Jkcy50b3AgKyAxMCxcclxuICAgICAgICBzdGFydExlZnRPZmY6IGlucHV0Q29yZHMubGVmdCArIDMwLFxyXG4gICAgICAgIGVuZFRvcE9mZjogMTUwLFxyXG4gICAgICAgIGVuZExlZnRPZmY6IDQ1MCxcclxuICAgICAgICBuYW1lOiBgeFRvTWFjaGluZSR7aW5kZXh9YFxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VNYWNoaW5lVG9ZKGlucHV0Q29yZHMsIGluZGV4KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHN0YWlyU3RlcCh7XHJcbiAgICAgICAgc3RhcnRUb3BPZmY6IDIwMCxcclxuICAgICAgICBzdGFydExlZnRPZmY6IDYzMCxcclxuICAgICAgICBlbmRUb3BPZmY6IGlucHV0Q29yZHMudG9wICsgMTAsXHJcbiAgICAgICAgZW5kTGVmdE9mZjogaW5wdXRDb3Jkcy5yaWdodCArIDUsXHJcbiAgICAgICAgbmFtZTogYG1hY2hpbmVUb1kke2luZGV4fWBcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlWVRvU3RhdHVzQmFyKGlucHV0Q29yZHMsIGluZGV4KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHN0YWlyU3RlcCh7XHJcbiAgICAgICAgc3RhcnRUb3BPZmY6IGlucHV0Q29yZHMudG9wICsgNSxcclxuICAgICAgICBzdGFydExlZnRPZmY6IGlucHV0Q29yZHMucmlnaHQgKyAxMCxcclxuICAgICAgICBlbmRUb3BPZmY6IDUwLFxyXG4gICAgICAgIGVuZExlZnRPZmY6IDQwMCxcclxuICAgICAgICBuYW1lOiBgeVRvU3RhdHVzQmFyJHtpbmRleH1gXHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuU2V0IHVwIHRoZSB4TWVtb3J5IGFycmF5IGFuZCB0aGUgYW5pbWF0aW9uIHBhdGhzIGZvciBlYWNoIGlucHV0IGJveC5cclxuXHJcbk5PVEU6IFNldHRpbmcgdXAgdGhlIHhNZW1vcnkgYXJyYXkgYWxzbyBtYWtlcyBpdCBzbyB0aGF0IG5vIGFuaW1hdGlvbnNcclxuICAgICAgYXJlIHJlcGVhdGVkIGJ5IG11bHRpcGxlIGNsaWNrcyBvbiB0aGUgXCJHbyFcIiBidXR0b24uXHJcbiovXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRDb3VudDsgaSsrKSB7XHJcbiAgICB4TWVtb3J5W2ldID0gbnVsbDtcclxuXHJcbiAgICB2YXIgaW5wdXRDb29yID0gaW5wdXRzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIG1ha2VYVG9NYWNoaW5lKGlucHV0Q29vciwgaSk7XHJcbiAgICBtYWtlTWFjaGluZVRvWShpbnB1dENvb3IsIGkpO1xyXG4gICAgbWFrZVlUb1N0YXR1c0JhcihpbnB1dENvb3IsIGkpO1xyXG4gICAgJChcIiNudW1Db250YWluZXJcIikuYXBwZW5kKCQoYDxwPjwvcD5gKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFVzZXJFeGNlcHRpb24obWVzc2FnZSwgZXJyb3JOdW0pIHtcclxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB0aGlzLmVycm9yTnVtID0gZXJyb3JOdW07XHJcbiAgICB0aGlzLm5hbWUgPSBcIlVzZXJFeGNlcHRpb25cIjtcclxufVxyXG5cclxuLypcclxuU2V0IHVwIHRoZSBvYmplY3QgdGhhdCB3aWxsIGJlIHBhc3NlZCB0aHJvdWdoIHRoZSBwcm9taXNlIGNoYWluXHJcbmluIGFuaW1hdG9yIGNvbnRyb2wuXHJcbiovXHJcbmZ1bmN0aW9uIHNldFVwT2JqZWN0KHhpbnB1dHMsIGdyYXBoT3B0LCBhbmlTZXR0aW5ncykge1xyXG4gICAgeGlucHV0cy5lYWNoKGZ1bmN0aW9uIChpKSB7XHJcblxyXG4gICAgICAgIHZhciB4dmFsdWUgPSAkKHRoaXMpLnZhbCgpLFxyXG4gICAgICAgICAgICB4dmFsLFxyXG4gICAgICAgICAgICByb3VuZGl0O1xyXG5cclxuICAgICAgICBpZiAoeHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHh2YWwgPSAreHZhbHVlO1xyXG4gICAgICAgICAgICByb3VuZGl0ID0geHZhbC50b0ZpeGVkKHByb2ZPcHQucm91bmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzKS52YWwocm91bmRpdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvZk9wdC52aWV3LngubWluIDw9IHJvdW5kaXQgJiYgcm91bmRpdCA8PSBwcm9mT3B0LnZpZXcueC5tYXgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVwbGFjZVggPSBncmFwaE9wdC5lcXVhdGlvbi5yZXBsYWNlKC94L2csIGAoJHtyb3VuZGl0fSlgKSxcclxuICAgICAgICAgICAgICAgICAgICB5dmFsID0gbWF0aC5ldmFsKHJlcGxhY2VYKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHl2YWwgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXRDb29yID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiByb3VuZGl0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogeXZhbC50b0ZpeGVkKHByb2ZPcHQucm91bmRpbmcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VFcXU6IHByb2ZPcHQubGF0ZXgucmVwbGFjZShcInhcIiwgYCgke3JvdW5kaXR9KWApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUG9pbnQ6IHhNZW1vcnlbaV0gIT09IHJvdW5kaXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAkKFwiI251bUNvbnRhaW5lciBwXCIpLmdldChpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVXNlckV4Y2VwdGlvbihcIm91dCBvZiBkb21haW5cIiwgeHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoSW5maW5pdHkgPT09IHl2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVXNlckV4Y2VwdGlvbihcInVuZGVmaW5lZCB2YWx1ZVwiLCB4dmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBDbGVhciBvdXQgdGhlIFlzIHdoZW4gdGhleSBkb24ndCBlcXVhbCBlYWNoIG90aGVyIGFuZCBuZWVkIHRvIGJlIHVwZGF0ZWRcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQudXBkYXRlUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGB0ZCN5dmFsJHtpICsgMX1gKS5odG1sKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qVXBkYXRlIHRoZSB4bWVtb3J5Ki9cclxuICAgICAgICAgICAgICAgIHhNZW1vcnlbaV0gPSByb3VuZGl0O1xyXG4gICAgICAgICAgICAgICAgYW5pU2V0dGluZ3MuZGF0YXBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBVc2VyRXhjZXB0aW9uKFwib3V0IG9mIHdpbmRvd1wiLCB4dmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcblNldCBhbGwgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHNldCB0byBhbmlTZXR0aW5ncyBpbiB0aGUgc2V0VXBPYmplY3QgZnVuY3Rpb25cclxuXHJcbk5PVEVcclxuZ3JhcGhPcHQuY2FsbGJhY2sgc3RpbGwgbmVlZHMgYSB2aWFibGUgbWV0aG9kIVxyXG4qL1xyXG5mdW5jdGlvbiBzdGFydEZ1bmNNYWNoKCkge1xyXG5cclxuICAgIHZhciB4aW5wdXRzID0gJChcImlucHV0W3R5cGU9J251bWJlciddXCIpLFxyXG4gICAgICAgIGdyYXBoT3B0ID0ge1xyXG4gICAgICAgICAgICBlcXVhdGlvbjogcHJvZk9wdC5lcXVhdGlvbixcclxuICAgICAgICAgICAgaGlkZUVxdWF0aW9uOiBwcm9mT3B0LmhpZGVFcXVhdGlvbixcclxuICAgICAgICAgICAgdmlldzogcHJvZk9wdC52aWV3LFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogYW5pRHVyYXRpb25cclxuICAgICAgICB9LFxyXG4gICAgICAgIGFuaVNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBkYXRhcG9pbnRzOiBbXSxcclxuICAgICAgICAgICAgY3VycmVudFJvdW5kOiAwLFxyXG4gICAgICAgICAgICBncmFwaE9wdDogZ3JhcGhPcHRcclxuICAgICAgICB9O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgc2V0VXBPYmplY3QoeGlucHV0cywgZ3JhcGhPcHQsIGFuaVNldHRpbmdzKTtcclxuICAgICAgICBhbmltYXRvckNvbnRyb2woYW5pU2V0dGluZ3MpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHhNZW1vcnkgPSBbXTtcclxuICAgICAgICAkKFwiI3N0YXR1cyBwXCIpXHJcbiAgICAgICAgICAgIC5odG1sKGAke2UuZXJyb3JOdW19IHgtdmFsdWUgJHtlLm1lc3NhZ2V9LmApXHJcbiAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJmb250V2VpZ2h0XCI6IFwiYm9sZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNiNjI3MjdcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLypCZWZvcmUgcnVubmluZyB0aGUgZnVuY3Rpb24gbWFjaGluZSwgcHV0IGFsbCBpbnB1dHMgbmV4dCB0byBlYWNoIG90aGVyLiovXHJcbmZ1bmN0aW9uIGNsZWFuSW5wdXRzKCkge1xyXG4gICAgdmFyIHhpbnB1dHMgPSAkKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIiksXHJcbiAgICAgICAgaW5wdXRBcnJheSA9IFtdO1xyXG5cclxuICAgIHhpbnB1dHMuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIHZhciBpbnB1dFZhbHVlID0gJCh0aGlzKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgaW5wdXRBcnJheS5wdXNoKGlucHV0VmFsdWUpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnZhbChcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHhpbnB1dHMuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIGlmIChpIDwgaW5wdXRBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS52YWwoaW5wdXRBcnJheVtpXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCh0aGlzKS52YWwoXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuJChcIiNjbG9zZUhlbHBcIikuY2xpY2soZSA9PiB7XHJcbiAgICAkKGUudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmZhZGVPdXQoMTAwKTtcclxuICAgICQoXCIjc2hhZGVcIikuZmFkZU91dCgyMDApO1xyXG4gICAgbG9jYWxTdG9yYWdlWydmaXJzdFRpbWVGdW5jdGlvbk1hY2hpbmUnXSA9IGZhbHNlO1xyXG59KTtcclxuXHJcbiQoXCIjb3BlbkhlbHBcIikuY2xpY2soZSA9PiB7XHJcbiAgICAkKFwiI2luc3RydWN0aW9uc1wiKS5mYWRlSW4oMTAwKTtcclxuICAgICQoXCIjc2hhZGVcIikuZmFkZUluKDEwMDApO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGUgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgZmlyc3R0aW1lID0gbG9jYWxTdG9yYWdlWydmaXJzdFRpbWVGdW5jdGlvbk1hY2hpbmUnXTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGZpcnN0dGltZSA9PT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgICAgJChcIiNpbnN0cnVjdGlvbnNcIikuaGlkZSgpO1xyXG4gICAgICAgICQoXCIjc2hhZGVcIikuaGlkZSgpO1xyXG4gICAgfVxyXG59KVxyXG5cclxuLypcclxuT25jaGFuZ2UgZXZlbnQgaGFuZGxlciBmb3IgdGhlIHNlbGVjdCBodG1sIGVsZW1lbnQuXHJcbiovXHJcbiQoXCJzZWxlY3RcIikuY2hhbmdlKGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgc2VsZWN0ZWQgPSAkKGBvcHRpb25bdmFsdWU9XCIke2UudGFyZ2V0LnZhbHVlfVwiXWApLFxyXG4gICAgICAgIHByb2ZPcHQgPSBKU09OLnBhcnNlKHNlbGVjdGVkLmF0dHIoXCJkYXRhLXByb2ZvcHRcIikpO1xyXG5cclxuICAgIHBsb3RHcmFwaC5zZXR1cChwcm9mT3B0LCBcIiNncmFwaFwiKVxyXG4gICAgY2hhbmdlUGxvdChlLnRhcmdldC52YWx1ZSk7XHJcbn0pO1xyXG5cclxuLypcclxuRE9DVU1FTlQga2V5ZG93biBldmVudCBoYW5kbGVyXHJcbiovXHJcbiQoZG9jdW1lbnQpLmtleXByZXNzKGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS53aGljaCA9PSAxMyAmJiBydW5NYXN0ZXIpIHtcclxuICAgICAgICBjbGVhbklucHV0cygpO1xyXG4gICAgICAgIHN0YXJ0RnVuY01hY2goKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vKlxyXG5HTyEgQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4qL1xyXG4kKFwiaW5wdXRbdHlwZT0nYnV0dG9uJ11bdmFsdWU9J0dvISddXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChydW5NYXN0ZXIpIHtcclxuICAgICAgICBjbGVhbklucHV0cygpO1xyXG4gICAgICAgIHN0YXJ0RnVuY01hY2goKTtcclxuICAgIH1cclxufSk7XHJcbiJdfQ==
