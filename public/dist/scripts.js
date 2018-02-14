"use strict";

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

        $(tr).attr("id", "row" + j);

        $(input).attr("name", "input" + j).attr("type", "number");

        $(td2).attr("id", "yval" + j);

        $(td1).append(input);
        $(tr).append(td1).append(td2);
        $(tbody).append(tr);
    }
})();
"use strict";

/*jslint plusplus: true, browser: true, devel: true*/
/*global d3, functionPlot*/
var plotGraph = function () {
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
            var zero = 0 .toFixed(2);

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
        var pointGroup = d3.selectAll(dotLocation).append('g').attr('class', 'point').attr('id', makePointId(currentPoint.id));

        //add the circle
        pointGroup.append('circle').attr('r', 4).attr('cx', 0).attr('cy', 0);

        //add the label
        pointGroup.append('text').text('(0, 0)').attr('x', 5).attr('y', 15);
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
                transition = pointGroup.transition().duration(aniOptions.graphOpt.duration * 1000).ease('cubic-out').attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(0) + ')');
                //sub transition - update the label
                transition.select('text').tween('text', updateTextX(currentPoint));

                //Second transition - move the group in the Y
                //sub transition - update the label
                transition.transition().duration(aniOptions.graphOpt.duration * 1000).ease('cubic-out').attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(currentPoint.y) + ')').each('end', function () {
                    callback(aniOptions);
                }).select('text').tween('text', updateTextY(currentPoint));
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
}();
"use strict";

$(document).ready(function () {

    /*
    Load Query substring
    */

    if (location.search == "") {
        //Default query string if nothing provided
        var queryVars = [];
        queryVars.push("file=funcMachineSettings");
    } else {
        // Grab the query string and options
        var queryVars = [];
        var queryString = location.search.substring(1);
        // Set queryVars to be array of parameters
        queryVars = queryString.split("&");
    }
    var allQueries = {};

    queryVars.forEach(function (query) {
        var pair = query.split("=");
        allQueries[pair[0]] = pair[1];
    });

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

        $(opt).val(profOpt.equation).attr("data-profOpt", stringifiedData);

        $("select").append(opt);
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
                $("input#showGraph[type='checkbox']").click(function (e) {
                    var checked = e.target.checked;
                    if (checked) {
                        document.querySelector(".graph").firstChild.style.display = "block";
                    } else {
                        document.querySelector(".graph").firstChild.style.display = "none";
                    }
                });

                changePlot(profOpt.equation);
            }
        });
    }).fail(function () {
        $("#status p").append("Add a query string");
    });
});
"use strict";

var equPara = $("#functionMachine #equ")[0],
    rangeSpeed = $("#animate").val(),
    aniDuration = 1 * 5 / rangeSpeed;

$('#animate').change(function (e) {
    aniDuration = 1 * 5 / e.target.value;
});

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
            $(numPara).html(value).css({
                "animation": "" + name + aniSettings.currentRound + " " + aniDuration + "s ease-in-out"
            }).one('animationend', function (e) {
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

    statusBar.html('').css({
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
            $(equPara).css("animation", "textDisappear " + aniDuration * 0.5 + "s ease-in-out").one("animationend", function (e) {
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
            katex.render("" + changeEqu, equPara);
            $(equPara).css("animation", "textAppear " + aniDuration * 0.5 + "s ease-in-out").one("animationend", function (e) {
                $(equPara).css("opacity", 1);
                resolve(aniSettings);
            });
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
            $(equPara).css("animation", "textDisappear " + aniDuration * 0.5 + "s ease-in-out").one("animationend", function () {
                $(equPara).css("opacity", 0);
                katex.render("" + pointData.y, equPara);
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
            $(equPara).css("animation", "textAppear " + aniDuration * 0.5 + "s ease-in-out").one("animationend", function (e) {
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
        var input = $("td#yval" + (pointData.id + 1))[0];
        $(input).html("");
        $(input).append("<p>" + pointData.y + "</p>");
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
            $(equPara).css("animation", "textDisappear " + aniDuration * 0.15 + "s ease-in-out").one("animationend", function (e) {
                $(equPara).css("opacity", 0);
                katex.render("" + profOpt.latex, equPara);
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
            $(equPara).css("animation", "textAppear " + aniDuration * 0.15 + "s ease-in-out").one("animationend", function (e) {
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
        });
        resolve(aniSettings);
    });
}

function stopAniFuncMachine(aniSettings) {
    return new Promise(function (resolve) {
        $("#functionMachine").css({
            "background-image": "url(./img/functionMachineStill.gif)"
        });
        resolve(aniSettings);
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
            para = $("<p>" + yvalue + "</p>");

        $(para).css({
            "fontSize": "20px"
        });

        $("body").append(para);

        para.css({
            position: "absolute",
            opacity: 0,
            left: 630,
            top: 160
        }).animate({
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
            chain = chain.then(runAnimation("xToMachine", datapoint.x)).then(animateFuncMachine).then(statusMessage("Calculating")).then(replaceXEqu).then(showEvaluateEqu).then(showYAns).then(showEquationAgain).then(stopAniFuncMachine).then(statusMessage("")).then(miniAni).then(runAnimation("machineToY", datapoint.y)).then(placeYValue).then(runAnimation("yToStatusBar", "(" + datapoint.x + "," + datapoint.y + ")")).then(statusMessage("Plotting (" + datapoint.x + "," + datapoint.y + ")")).then(plotter).then(statusMessage("")).then(resetRound).then(showDefaultEqu);
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
            chain = chain.then(placeYValue).then(statusMessage("Plotting (" + datapoint.x + "," + datapoint.y + ")")).then(plotter);
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
"use strict";

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

    inputs[i].onkeyup = function (e) {

        var xInputVal = e.srcElement.value;

        if (e.which === 69) {
            e.target.value = "";
            $("#status p").html("Can't do that bro!");
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
    });
    return profOpt;
}

/*
Upon choosing another equation to graph, clear all the values
*/
function clearValues() {
    var xinputs = $("input[type='number']"),
        yinputs = $("tr td:nth-of-type(2)");

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
        $(equPara).append("<h2>Mystery Equation</h2>").css({
            "paddingTop": "5px"
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
    lastSheet.insertRule("@keyframes " + options.name + " {\n                            0% {\n                                opacity: 1;\n                                top: " + options.startTopOff + "px;\n                                left: " + options.startLeftOff + "px;\n                            }\n                            10% {\n                                opacity: 1;\n                            }\n                            33% {\n                                top: " + options.startTopOff + "px;\n                                left: " + highwayPath + "px;\n                            }\n                            66% {\n                                top: " + options.endTopOff + "px;\n                                left: " + highwayPath + "px;\n                            }\n                            90% {\n                                opacity: 1;\n                            }\n                            100% {\n                                opacity: 0;\n                                top: " + options.endTopOff + "px;\n                                left: " + options.endLeftOff + "px;\n                            }\n                        }", lastSheet.cssRules.length);
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
        name: "xToMachine" + index
    });
}

function makeMachineToY(inputCords, index) {
    "use strict";

    stairStep({
        startTopOff: 200,
        startLeftOff: 630,
        endTopOff: inputCords.top + 10,
        endLeftOff: inputCords.right + 5,
        name: "machineToY" + index
    });
}

function makeYToStatusBar(inputCords, index) {
    "use strict";

    stairStep({
        startTopOff: inputCords.top + 5,
        startLeftOff: inputCords.right + 10,
        endTopOff: 50,
        endLeftOff: 400,
        name: "yToStatusBar" + index
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
    $("#numContainer").append($("<p></p>"));
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

                var replaceX = graphOpt.equation.replace(/x/g, "(" + roundit + ")"),
                    yval = math.eval(replaceX);

                if (typeof yval === "number") {
                    var inputCoor = this.getBoundingClientRect(),
                        point = {
                        x: roundit,
                        y: yval.toFixed(profOpt.rounding),
                        id: i,
                        changeEqu: profOpt.latex.replace("x", "(" + roundit + ")"),
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
                    $("td#yval" + (i + 1)).html("");
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
        $("#status p").html(e.errorNum + " x-value " + e.message + ".").css({
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
    });

    xinputs.each(function (i) {
        if (i < inputArray.length) {
            $(this).val(inputArray[i]);
        } else {
            $(this).val("");
        }
    });
}

$("#closeHelp").click(function (e) {
    $(e.target.parentElement).fadeOut(100);
    $("#shade").fadeOut(200);
    localStorage['firstTimeFunctionMachine'] = false;
});

$("#openHelp").click(function (e) {
    $("#instructions").fadeIn(100);
    $("#shade").fadeIn(1000);
});

$(document).ready(function (e) {
    try {
        var firsttime = localStorage['firstTimeFunctionMachine'];
    } catch (e) {
        console.error(e);
    }
    if (firsttime === "false") {
        $("#instructions").hide();
        $("#shade").hide();
    }
});

/*
Onchange event handler for the select html element.
*/
$("select").change(function (e) {
    var selected = $("option[value=\"" + e.target.value + "\"]"),
        profOpt = JSON.parse(selected.attr("data-profopt"));

    plotGraph.setup(profOpt, "#graph");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJwbG90R3JhcGguanMiLCJhamF4LmpzIiwiYW5pbWF0b3Jjb250cm9sLmpzIiwiZXZlbnRzLmpzIl0sIm5hbWVzIjpbInRib2R5IiwiJCIsInRkMSIsInRkMiIsInRyIiwiaW5wdXQiLCJyb3dDb3VudCIsImoiLCJhdHRyIiwiYXBwZW5kIiwicGxvdEdyYXBoIiwiZ3JhcGhMb2NhdGlvblNlbGVjdG9yIiwiZG90TG9jYXRpb24iLCJjdXJyZW50RXF1YXRpb24iLCJmdW5QbG90IiwieFNjYWxlIiwieVNjYWxlIiwiZnJlZUlkIiwidXBkYXRlVGV4dFgiLCJjdXJyZW50UG9pbnQiLCJkIiwiemVybyIsInRvRml4ZWQiLCJ0IiwibG9jYXRpb24iLCJ4IiwidGV4dENvbnRlbnQiLCJ1cGRhdGVUZXh0WSIsInhSb3VuZGVkIiwieVZhbCIsInkiLCJtYWtlUG9pbnRJZCIsIm51bUluIiwibWFrZVBvaW50R3JvdXAiLCJwb2ludEdyb3VwIiwiZDMiLCJzZWxlY3RBbGwiLCJpZCIsInRleHQiLCJ1cGRhdGUiLCJhbmlPcHRpb25zIiwiY2FsbGJhY2siLCJkYXRhcG9pbnRzIiwiY3VycmVudFJvdW5kIiwibGluZUlzUGxvdHRlZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsInRyYW5zaXRpb24iLCJmb3JFYWNoIiwicG9pbnQiLCJ1cGRhdGVQb2ludCIsInNlbGVjdCIsInJlbW92ZSIsImdyYXBoT3B0IiwiZ3JhcGhIaWRlIiwiZHVyYXRpb24iLCJlYXNlIiwidHdlZW4iLCJlYWNoIiwic2V0dXAiLCJzZWxlY3RvciIsIm9wdHNJbiIsImdyYXBoT3B0aW9ucyIsInRhcmdldCIsImRhdGEiLCJmbiIsImVxdWF0aW9uIiwic2tpcFRpcCIsInhBeGlzIiwiZG9tYWluIiwidmlldyIsIm1pbiIsIm1heCIsInlBeGlzIiwiZGlzYWJsZVpvb20iLCJncmlkIiwiYW5ub3RhdGlvbnMiLCJmdW5jdGlvblBsb3QiLCJtZXRhIiwicmVhZHkiLCJzZWFyY2giLCJxdWVyeVZhcnMiLCJwdXNoIiwicXVlcnlTdHJpbmciLCJzdWJzdHJpbmciLCJzcGxpdCIsImFsbFF1ZXJpZXMiLCJxdWVyeSIsInBhaXIiLCJjb25zb2xlIiwibG9nIiwic2hvd1Byb2ZPcHRpb25zIiwicHJvZk9wdCIsImluaXQiLCJzdHJpbmdpZmllZERhdGEiLCJKU09OIiwic3RyaW5naWZ5Iiwib3B0IiwibmFtZSIsInZhbCIsImdldEpTT04iLCJmaWxlIiwicmVzdWx0IiwibG9hZCIsImdlbmVyYWwiLCJodG1sIiwidGl0bGUiLCJpbnN0cnVjdGlvbnMiLCJ3aW5kb3ciLCJwcm9mZXNzb3JDb25maWdGaWxlIiwiZXF1YXRpb25zIiwiaSIsInF1ZXJ5U2VsZWN0b3IiLCJmaXJzdENoaWxkIiwic3R5bGUiLCJkaXNwbGF5IiwiY2xpY2siLCJjaGVja2VkIiwiZSIsImNoYW5nZVBsb3QiLCJmYWlsIiwiZXF1UGFyYSIsInJhbmdlU3BlZWQiLCJhbmlEdXJhdGlvbiIsImNoYW5nZSIsInZhbHVlIiwicnVuQW5pbWF0aW9uIiwiYW5pbWF0aW9uIiwiYW5pU2V0dGluZ3MiLCJkYXRhcG9pbnQiLCJudW1QYXJhIiwiZWxlbWVudCIsIlByb21pc2UiLCJyZXNvbHZlIiwiY3NzIiwib25lIiwic3RhdHVzTWVzc2FnZSIsIm1lc3NhZ2UiLCJzdGF0dXNCYXIiLCJyZXBsYWNlWEVxdSIsImhpZGVFcXVhdGlvbiIsInNob3dFdmFsdWF0ZUVxdSIsInBvaW50RGF0YSIsImNoYW5nZUVxdSIsImthdGV4IiwicmVuZGVyIiwic2hvd1lBbnMiLCJzaG93RXF1YXRpb25BZ2FpbiIsInBsYWNlWVZhbHVlIiwicmVzZXRSb3VuZCIsImxhdGV4Iiwic2hvd0RlZmF1bHRFcXUiLCJwbG90dGVyIiwidXBkYXRlUm91bmQiLCJwbGFjZWhvbGRlciIsImFuaW1hdGVGdW5jTWFjaGluZSIsInN0b3BBbmlGdW5jTWFjaGluZSIsIm1pbmlBbmkiLCJ5dmFsdWUiLCJwYXJhIiwicG9zaXRpb24iLCJvcGFjaXR5IiwibGVmdCIsInRvcCIsImFuaW1hdGUiLCJhbmlQcm9taXNlQ2hhaW4iLCJkcHMiLCJjaGFpbiIsInRoZW4iLCJhbmltYXRlSGlkZSIsImFuaW1hdG9yQ29udHJvbCIsIm51bUNvbnRhaW5lciIsImlubmVySFRNTCIsInhNZW1vcnkiLCJpbnB1dHMiLCJpbnB1dENvdW50IiwicnVuTWFzdGVyIiwicnVuIiwib25rZXl1cCIsInhJbnB1dFZhbCIsInNyY0VsZW1lbnQiLCJ3aGljaCIsImNoZWNrQ29uZmlnIiwiaXRlbSIsImNsZWFyVmFsdWVzIiwieGlucHV0cyIsInlpbnB1dHMiLCJlcXVhdCIsImVtcHR5Iiwic3RhaXJTdGVwIiwib3B0aW9ucyIsImhpZ2h3YXlQYXRoIiwibGFzdFNoZWV0Iiwic3R5bGVTaGVldHMiLCJpbnNlcnRSdWxlIiwic3RhcnRUb3BPZmYiLCJzdGFydExlZnRPZmYiLCJlbmRUb3BPZmYiLCJlbmRMZWZ0T2ZmIiwiY3NzUnVsZXMiLCJtYWtlWFRvTWFjaGluZSIsImlucHV0Q29yZHMiLCJpbmRleCIsIm1ha2VNYWNoaW5lVG9ZIiwicmlnaHQiLCJtYWtlWVRvU3RhdHVzQmFyIiwiaW5wdXRDb29yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiVXNlckV4Y2VwdGlvbiIsImVycm9yTnVtIiwic2V0VXBPYmplY3QiLCJ4dmFsdWUiLCJ4dmFsIiwicm91bmRpdCIsInJvdW5kaW5nIiwicmVwbGFjZVgiLCJyZXBsYWNlIiwieXZhbCIsIm1hdGgiLCJldmFsIiwiZ2V0IiwiSW5maW5pdHkiLCJzdGFydEZ1bmNNYWNoIiwiY2xlYW5JbnB1dHMiLCJpbnB1dEFycmF5IiwiaW5wdXRWYWx1ZSIsInBhcmVudEVsZW1lbnQiLCJmYWRlT3V0IiwibG9jYWxTdG9yYWdlIiwiZmFkZUluIiwiZmlyc3R0aW1lIiwiZXJyb3IiLCJoaWRlIiwic2VsZWN0ZWQiLCJwYXJzZSIsImtleXByZXNzIl0sIm1hcHBpbmdzIjoiOztBQUFDLGFBQVk7QUFDVDs7QUFFQTs7OztBQUdBLFFBQUlBLFFB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QUFWLEVBQWE7QUFDOUIsUUFBSUEsRUFBRStELEtBQUYsSUFBVyxFQUFYLElBQWlCTCxTQUFyQixFQUFnQztBQUM1QitDO0FBQ0FEO0FBQ0g7QUFDSixDQUxEOztBQU9BOzs7QUFHQTlOLEVBQUUsbUNBQUYsRUFBdUNvSCxLQUF2QyxDQUE2QyxZQUFZO0FBQ3JELFFBQUk0RCxTQUFKLEVBQWU7QUFDWCtDO0FBQ0FEO0FBQ0g7QUFDSixDQUxEIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLypcclxuICAgIE1ha2UgdGhlIHdob2xlIHRhYmxlIGFuZCBjZWxscyBmb3IgdGhlIGlucHV0IGJveGVzIGFuZCB1c2VyIGludGVyYWN0aW9uLlxyXG4gICAgKi9cclxuICAgIHZhciB0Ym9keSA9ICQoXCJ0Ym9keVwiKSxcclxuICAgICAgICB0ZDEsXHJcbiAgICAgICAgdGQyLFxyXG4gICAgICAgIHRyLFxyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIHJvd0NvdW50ID0gMTA7XHJcblxyXG4gICAgZm9yICh2YXIgaiA9IDE7IGogPD0gcm93Q291bnQ7IGorKykge1xyXG4gICAgICAgIGlucHV0ID0gJChcIjxpbnB1dD5cIik7XHJcbiAgICAgICAgdGQxID0gJChcIjx0ZD48L3RkPlwiKTtcclxuICAgICAgICB0ZDIgPSAkKFwiPHRkPjwvdGQ+XCIpO1xyXG4gICAgICAgIHRyID0gJChcIjx0cj48L3RyPlwiKTtcclxuXHJcbiAgICAgICAgJCh0cikuYXR0cihcImlkXCIsIGByb3cke2p9YCk7XHJcblxyXG4gICAgICAgICQoaW5wdXQpLmF0dHIoXCJuYW1lXCIsIGBpbnB1dCR7an1gKS5hdHRyKFwidHlwZVwiLCBcIm51bWJlclwiKTtcclxuXHJcbiAgICAgICAgJCh0ZDIpLmF0dHIoXCJpZFwiLCBgeXZhbCR7an1gKTtcclxuXHJcbiAgICAgICAgJCh0ZDEpLmFwcGVuZChpbnB1dCk7XHJcbiAgICAgICAgJCh0cikuYXBwZW5kKHRkMSkuYXBwZW5kKHRkMik7XHJcbiAgICAgICAgJCh0Ym9keSkuYXBwZW5kKHRyKTtcclxuICAgIH1cclxufSgpKTtcclxuIiwiLypqc2xpbnQgcGx1c3BsdXM6IHRydWUsIGJyb3dzZXI6IHRydWUsIGRldmVsOiB0cnVlKi9cclxuLypnbG9iYWwgZDMsIGZ1bmN0aW9uUGxvdCovXHJcbnZhciBwbG90R3JhcGggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgZ3JhcGhMb2NhdGlvblNlbGVjdG9yLFxyXG4gICAgICAgIGRvdExvY2F0aW9uLFxyXG4gICAgICAgIGN1cnJlbnRFcXVhdGlvbixcclxuICAgICAgICBmdW5QbG90LFxyXG4gICAgICAgIHhTY2FsZSxcclxuICAgICAgICB5U2NhbGUsXHJcbiAgICAgICAgZnJlZUlkID0gMDtcclxuXHJcbiAgICAvL3RoZXNlIHR3byBmdW5jdGlvbnMgbWFrZSB0aGUgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgaW4gdGhlIGFuaW1hdGlvbnMgZm9yIHRoZSBwb2ludCBsYWJlbHNcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRleHRYKGN1cnJlbnRQb2ludCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB2YXIgemVybyA9ICgwKS50b0ZpeGVkKDIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjdXJyZW50UG9pbnQueCAqIHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRDb250ZW50ID0gXCIoIFwiICsgbG9jYXRpb24udG9GaXhlZCgyKSArIFwiLCBcIiArIHplcm8gKyBcIilcIjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRleHRZKGN1cnJlbnRQb2ludCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgeFJvdW5kZWQgPSBjdXJyZW50UG9pbnQueCxcclxuICAgICAgICAgICAgICAgIHlWYWwgPSBjdXJyZW50UG9pbnQueTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0Q29udGVudCA9IFwiKCBcIiArIHhSb3VuZGVkICsgXCIsIFwiICsgKHlWYWwgKiB0KS50b0ZpeGVkKDIpICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlUG9pbnRJZChudW1Jbikge1xyXG4gICAgICAgIHJldHVybiAnZ3JhcGhQb2ludCcgKyBudW1JbjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlUG9pbnRHcm91cChjdXJyZW50UG9pbnQpIHtcclxuICAgICAgICB2YXIgcG9pbnRHcm91cCA9IGQzLnNlbGVjdEFsbChkb3RMb2NhdGlvbikuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BvaW50JylcclxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgbWFrZVBvaW50SWQoY3VycmVudFBvaW50LmlkKSk7XHJcblxyXG4gICAgICAgIC8vYWRkIHRoZSBjaXJjbGVcclxuICAgICAgICBwb2ludEdyb3VwLmFwcGVuZCgnY2lyY2xlJylcclxuICAgICAgICAgICAgLmF0dHIoJ3InLCA0KVxyXG4gICAgICAgICAgICAuYXR0cignY3gnLCAwKVxyXG4gICAgICAgICAgICAuYXR0cignY3knLCAwKTtcclxuXHJcbiAgICAgICAgLy9hZGQgdGhlIGxhYmVsXHJcbiAgICAgICAgcG9pbnRHcm91cC5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAgICAgICAudGV4dCgnKDAsIDApJylcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCA1KVxyXG4gICAgICAgICAgICAuYXR0cigneScsIDE1KTtcclxuICAgICAgICAvL21vdmUgaXQgdG8gKDAsMClcclxuICAgICAgICBwb2ludEdyb3VwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhTY2FsZSgwKSArICcgJyArIHlTY2FsZSgwKSArICcpJyk7XHJcbiAgICAgICAgcmV0dXJuIHBvaW50R3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGFuaU9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRQb2ludCA9IGFuaU9wdGlvbnMuZGF0YXBvaW50c1thbmlPcHRpb25zLmN1cnJlbnRSb3VuZF0sXHJcbiAgICAgICAgICAgIGxpbmVJc1Bsb3R0ZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvdExvY2F0aW9uICsgJyAuZ3JhcGggLmxpbmUnKS5sZW5ndGggPiAwLFxyXG4gICAgICAgICAgICBwb2ludEdyb3VwLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uO1xyXG5cclxuICAgICAgICAvL2NsZWFyIGFueSBwb2ludHMgdGhhdCB3aWxsIGdldCB1cGRhdGVkXHJcbiAgICAgICAgYW5pT3B0aW9ucy5kYXRhcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKHBvaW50KSB7XHJcbiAgICAgICAgICAgIGlmIChwb2ludC51cGRhdGVQb2ludCkge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KCcjJyArIG1ha2VQb2ludElkKHBvaW50LmlkKSkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayBpZiB3ZSBuZWVkIHRvIGhpZGUgb3Igc2hvdyB0aGUgcGxvdGxpbmVcclxuICAgICAgICBpZiAoYW5pT3B0aW9ucy5ncmFwaE9wdC5ncmFwaEhpZGUpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KGRvdExvY2F0aW9uICsgJyAuZ3JhcGggLmxpbmUnKS5hdHRyKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QoZG90TG9jYXRpb24gKyAnIC5ncmFwaCAubGluZScpLmF0dHIoJ2Rpc3BsYXknLCAnaW5saW5lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2RvZXMgdGhlIGN1cnJlbnRSb3VuZCBuZWVkIHRvIGJlIHVwZGF0ZWRlZD9cclxuICAgICAgICBpZiAoIWN1cnJlbnRQb2ludC51cGRhdGVQb2ludCkge1xyXG4gICAgICAgICAgICAvL25vdGhpdG5nIHRvIHNlZSBoZXJlIGp1c3Qga2VlcCBvbiBtb3ZpbmdcclxuICAgICAgICAgICAgY2FsbGJhY2soYW5pT3B0aW9ucyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9kcmF3IHBvaW50XHJcbiAgICAgICAgICAgIHBvaW50R3JvdXAgPSBtYWtlUG9pbnRHcm91cChjdXJyZW50UG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgLy9pcyBhbmltYXRpb24gb24/XHJcbiAgICAgICAgICAgIGlmIChhbmlPcHRpb25zLmdyYXBoT3B0LmR1cmF0aW9uIDw9IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgLy9tb3ZlIGl0IGludG8gcGxhY2Ugd2l0aG91dCBhbmltYXRpb25cclxuICAgICAgICAgICAgICAgIHBvaW50R3JvdXAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeFNjYWxlKGN1cnJlbnRQb2ludC54KSArICcgJyArIHlTY2FsZShjdXJyZW50UG9pbnQueSkgKyAnKScpO1xyXG4gICAgICAgICAgICAgICAgLy91cGRhdGUgdGhlIGxhYmxlXHJcbiAgICAgICAgICAgICAgICBwb2ludEdyb3VwLnNlbGVjdCgndGV4dCcpLnRleHQoJygnICsgY3VycmVudFBvaW50LnggKyAnLCAnICsgY3VycmVudFBvaW50LnkgKyAnKScpO1xyXG4gICAgICAgICAgICAgICAgLy9jYWxsIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhhbmlPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL2RyYXcgcG9pbnQgd2l0aCBhbmltYWlvblxyXG4gICAgICAgICAgICAgICAgLy9GaXJzdCB0cmFuc2l0aW9uIC0gbW92ZSB0aGUgZ3JvdXAgaW4gdGhlIFhcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gPSBwb2ludEdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihhbmlPcHRpb25zLmdyYXBoT3B0LmR1cmF0aW9uICogMTAwMClcclxuICAgICAgICAgICAgICAgICAgICAuZWFzZSgnY3ViaWMtb3V0JylcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeFNjYWxlKGN1cnJlbnRQb2ludC54KSArICcgJyArIHlTY2FsZSgwKSArICcpJyk7XHJcbiAgICAgICAgICAgICAgICAvL3N1YiB0cmFuc2l0aW9uIC0gdXBkYXRlIHRoZSBsYWJlbFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5zZWxlY3QoJ3RleHQnKS50d2VlbigndGV4dCcsIHVwZGF0ZVRleHRYKGN1cnJlbnRQb2ludCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vU2Vjb25kIHRyYW5zaXRpb24gLSBtb3ZlIHRoZSBncm91cCBpbiB0aGUgWVxyXG4gICAgICAgICAgICAgICAgLy9zdWIgdHJhbnNpdGlvbiAtIHVwZGF0ZSB0aGUgbGFiZWxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24udHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKGFuaU9wdGlvbnMuZ3JhcGhPcHQuZHVyYXRpb24gKiAxMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5lYXNlKCdjdWJpYy1vdXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4U2NhbGUoY3VycmVudFBvaW50LngpICsgJyAnICsgeVNjYWxlKGN1cnJlbnRQb2ludC55KSArICcpJylcclxuICAgICAgICAgICAgICAgICAgICAuZWFjaCgnZW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhhbmlPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZWxlY3QoJ3RleHQnKS50d2VlbigndGV4dCcsIHVwZGF0ZVRleHRZKGN1cnJlbnRQb2ludCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwKGFuaU9wdGlvbnMsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgLy9zdWdhclxyXG4gICAgICAgIHZhciBvcHRzSW4gPSBhbmlPcHRpb25zLmdyYXBoT3B0LFxyXG4gICAgICAgICAgICBncmFwaE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW3tcclxuICAgICAgICAgICAgICAgICAgICBmbjogb3B0c0luLmVxdWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIHNraXBUaXA6IHRydWVcclxuICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBkb21haW46IFtvcHRzSW4udmlldy54Lm1pbiwgb3B0c0luLnZpZXcueC5tYXhdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBkb21haW46IFtvcHRzSW4udmlldy55Lm1pbiwgb3B0c0luLnZpZXcueS5tYXhdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZVpvb206IHRydWUsXHJcbiAgICAgICAgICAgICAgICBncmlkOiB0cnVlLFxyXG5cdFx0XHRcdGFubm90YXRpb25zOiBbe1xyXG5cdFx0XHRcdFx0eDogMCxcclxuXHRcdFx0XHRcdHRleHQ6ICd5IGF4aXMnXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0eTogMCxcclxuXHRcdFx0XHRcdHRleHQ6ICd4IGF4aXMnXHJcblx0XHRcdFx0fV1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9zYXZlIHNvbWUgdGhpbmdzIGZvciBsYXRlclxyXG4gICAgICAgIGdyYXBoTG9jYXRpb25TZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgIGRvdExvY2F0aW9uID0gZ3JhcGhMb2NhdGlvblNlbGVjdG9yICsgJyAuY29udGVudCc7XHJcbiAgICAgICAgY3VycmVudEVxdWF0aW9uID0gb3B0c0luLmVxdWF0aW9uO1xyXG5cclxuICAgICAgICAvL21ha2UgdGhlIHBsb3QgYW5kIHNjYWxlc1xyXG4gICAgICAgIGZ1blBsb3QgPSBmdW5jdGlvblBsb3QoZ3JhcGhPcHRpb25zKTtcclxuICAgICAgICB4U2NhbGUgPSBmdW5QbG90Lm1ldGEueFNjYWxlO1xyXG4gICAgICAgIHlTY2FsZSA9IGZ1blBsb3QubWV0YS55U2NhbGU7XHJcblxyXG4gICAgICAgIC8vY2xlYW4gb3V0IGFueSBvbGQgcG9pbnRzIGZpcnN0XHJcbiAgICAgICAgZDMuc2VsZWN0QWxsKGRvdExvY2F0aW9uICsgJyAucG9pbnQnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICAgIHNldHVwOiBzZXR1cFxyXG4gICAgfTtcclxufSgpKTtcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8qXHJcbiAgICBMb2FkIFF1ZXJ5IHN1YnN0cmluZ1xyXG4gICAgKi9cclxuXHJcbiAgICBpZiAobG9jYXRpb24uc2VhcmNoID09IFwiXCIpIHtcclxuICAgICAgICAgICAgLy9EZWZhdWx0IHF1ZXJ5IHN0cmluZyBpZiBub3RoaW5nIHByb3ZpZGVkXHJcbiAgICAgICAgdmFyIHF1ZXJ5VmFycyA9IFtdO1xyXG4gICAgICAgIHF1ZXJ5VmFycy5wdXNoKFwiZmlsZT1mdW5jTWFjaGluZVNldHRpbmdzXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICAvLyBHcmFiIHRoZSBxdWVyeSBzdHJpbmcgYW5kIG9wdGlvbnNcclxuICAgICAgICB2YXIgcXVlcnlWYXJzID0gW107XHJcbiAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgLy8gU2V0IHF1ZXJ5VmFycyB0byBiZSBhcnJheSBvZiBwYXJhbWV0ZXJzXHJcbiAgICAgICAgcXVlcnlWYXJzID0gcXVlcnlTdHJpbmcuc3BsaXQoXCImXCIpO1xyXG5cclxuICAgIH1cclxuICAgIHZhciBhbGxRdWVyaWVzID0ge307XHJcblxyXG4gICAgcXVlcnlWYXJzLmZvckVhY2goZnVuY3Rpb24gKHF1ZXJ5KXtcclxuICAgICAgICB2YXIgcGFpciA9IHF1ZXJ5LnNwbGl0KFwiPVwiKTtcclxuICAgICAgICBhbGxRdWVyaWVzW3BhaXJbMF1dID0gcGFpclsxXTtcclxuICAgIH0pXHJcblxyXG4vLyAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXJ5VmFycy5sZW5ndGg7IGkrKykge1xyXG4vLyAgICAgICAgdmFyIHBhaXIgPSBxdWVyeVZhcnNbaV0uc3BsaXQoXCI9XCIpO1xyXG4vLyAgICAgICAgYWxsUXVlcmllc1twYWlyWzBdXSA9IHBhaXJbMV07XHJcbi8vICAgIH0gXHJcbmNvbnNvbGUubG9nKHF1ZXJ5VmFycyk7XHJcbiAgICBmdW5jdGlvbiBzaG93UHJvZk9wdGlvbnMocHJvZk9wdCwgaW5pdCkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgQXBwZW5kIHRoZSBwcm9mZXNzb3IncyBjaG9zZW4gZXF1YXRpb25zIHRvIHRoZSBhcHBsaWNhdGlvblxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIHZhciBzdHJpbmdpZmllZERhdGEgPSBKU09OLnN0cmluZ2lmeShpbml0KSxcclxuICAgICAgICAgICAgb3B0ID0gJChcIjxvcHRpb24+PC9vcHRpb24+XCIpLmFwcGVuZChwcm9mT3B0Lm5hbWUpO1xyXG5cclxuICAgICAgICAkKG9wdClcclxuICAgICAgICAgICAgLnZhbChwcm9mT3B0LmVxdWF0aW9uKVxyXG4gICAgICAgICAgICAuYXR0cihcImRhdGEtcHJvZk9wdFwiLCBzdHJpbmdpZmllZERhdGEpO1xyXG5cclxuICAgICAgICAkKFwic2VsZWN0XCIpXHJcbiAgICAgICAgICAgIC5hcHBlbmQob3B0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgTG9hZCB0aGUgcHJvZmVzc29yIGNvbmZpZ3VyYXRpb24gZmlsZVxyXG5cclxuICAgIGdlbmVyYWwgcXVlcnk6ID9maWxlPWZ1bmNNYWNoaW5lU2V0dGluZ3MmbG9hZD1nZW5lcmFsXHJcbiAgICAqL1xyXG5cclxuICAgICQuZ2V0SlNPTihhbGxRdWVyaWVzLmZpbGUgKyBcIi5qc29uXCIsIGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBcImxvYWRcIiBxdWVyeSwgbG9hZCBpdCwgb3RoZXJ3aXNlIGxvYWQgdGhlIGdlbmVyYWwgb3B0aW9uLlxyXG4gICAgICAgIGlmIChhbGxRdWVyaWVzLmxvYWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gZGF0YVthbGxRdWVyaWVzLmxvYWRdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGRhdGEuZ2VuZXJhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIjdGl0bGVcIikuaHRtbChyZXN1bHQudGl0bGUpO1xyXG4gICAgICAgICQoXCIjaW5zdHJ1Y3Rpb25UZXh0XCIpLmh0bWwocmVzdWx0Lmluc3RydWN0aW9ucyk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5wcm9mZXNzb3JDb25maWdGaWxlID0gcmVzdWx0LmVxdWF0aW9ucztcclxuXHJcbiAgICAgICAgJC5lYWNoKHJlc3VsdC5lcXVhdGlvbnMsIGZ1bmN0aW9uIChpLCBwcm9mT3B0KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW5pdCA9IHtcclxuICAgICAgICAgICAgICAgIGdyYXBoT3B0OiBwcm9mT3B0XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzaG93UHJvZk9wdGlvbnMocHJvZk9wdCwgaW5pdCk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBEaXNwbGF5IHRoZSBkZWZhdWx0IGVxdWF0aW9uIHRvIHRoZSBmdW5jdGlvbiBtYWNoaW5lXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmIChpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL2luIGV2ZW50cy5qc1xyXG4gICAgICAgICAgICAgICAgcGxvdEdyYXBoLnNldHVwKGluaXQsIFwiI2dyYXBoXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ3JhcGhcIikuZmlyc3RDaGlsZC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLypDaGVja2JveCBvbmNsaWNrIGV2ZW50Ki9cclxuICAgICAgICAgICAgICAgICQoXCJpbnB1dCNzaG93R3JhcGhbdHlwZT0nY2hlY2tib3gnXVwiKS5jbGljayhlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tlZCA9IGUudGFyZ2V0LmNoZWNrZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ncmFwaFwiKS5maXJzdENoaWxkLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ncmFwaFwiKS5maXJzdENoaWxkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGNoYW5nZVBsb3QocHJvZk9wdC5lcXVhdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiI3N0YXR1cyBwXCIpLmFwcGVuZChcIkFkZCBhIHF1ZXJ5IHN0cmluZ1wiKVxyXG4gICAgfSk7XHJcblxyXG59KTtcclxuIiwidmFyIGVxdVBhcmEgPSAkKFwiI2Z1bmN0aW9uTWFjaGluZSAjZXF1XCIpWzBdLFxyXG4gICAgcmFuZ2VTcGVlZCA9ICQoXCIjYW5pbWF0ZVwiKS52YWwoKSxcclxuICAgIGFuaUR1cmF0aW9uID0gKDEgKiA1KSAvIHJhbmdlU3BlZWQ7XHJcblxyXG4kKCcjYW5pbWF0ZScpLmNoYW5nZShlID0+IHtcclxuICAgIGFuaUR1cmF0aW9uID0gKDEgKiA1KSAvIGUudGFyZ2V0LnZhbHVlO1xyXG59KVxyXG5cclxuZnVuY3Rpb24gcnVuQW5pbWF0aW9uKG5hbWUsIHZhbHVlKSB7XHJcbiAgICAvKlxyXG4gICAgVGhpcyBpcyBhIGZ1bmN0aW9uIGZhY3Rvcnkgd2hpY2ggd2lsbCBncmFiIHRoZVxyXG4gICAgbmVjZXNzYXJ5IGRhdGEgYW5kIHRoZW4gcmV0dXJuIHRoZSBmdW5jdGlvbiBwcm9taXNlXHJcbiAgICAqL1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGFuaW1hdGlvbihhbmlTZXR0aW5ncykge1xyXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgICAgIHZhciBkYXRhcG9pbnQgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF0sXHJcbiAgICAgICAgICAgIG51bVBhcmEgPSBkYXRhcG9pbnQuZWxlbWVudDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBNYWtlIHRoZSBwcm9taXNlIHRoYXQgd2hlbiB0aGUgZHluYW1pY1xyXG4gICAgICAgIGFuaW1hdGlvbiBwYXRoIGlzIGRvbmUgdGhlbiB0aGlzIHByb21pc2UgaXMgZmluaXNoZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAkKG51bVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuaHRtbCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYW5pbWF0aW9uXCI6IGAke25hbWV9JHthbmlTZXR0aW5ncy5jdXJyZW50Um91bmR9ICR7YW5pRHVyYXRpb259cyBlYXNlLWluLW91dGAsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RhdHVzTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIC8qXHJcbiAgICBUaGlzIGlzIGEgZnVuY3Rpb24gZmFjdG9yeSB3aGljaCB3aWxsIGdyYWIgdGhlXHJcbiAgICBuZWNlc3NhcnkgZGF0YSBhbmQgdGhlbiByZXR1cm4gdGhlIGZ1bmN0aW9uIHByb21pc2VcclxuICAgICovXHJcbiAgICB2YXIgc3RhdHVzQmFyID0gJChcIiNzdGF0dXMgcFwiKTtcclxuXHJcbiAgICBzdGF0dXNCYXJcclxuICAgICAgICAuaHRtbCgnJylcclxuICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgXCJmb250V2VpZ2h0XCI6IFwibm9ybWFsXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCJibGFja1wiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhbmlTZXR0aW5ncykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICBzdGF0dXNCYXIuaHRtbChtZXNzYWdlKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVwbGFjZVhFcXUoYW5pU2V0dGluZ3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qXHJcbiAgICBSZXBsYWNlIHRoZSB4IGluIHRoZSBkaXNhcHBlYXJlZCBlcXVhdGlvbiB3aXRob3V0IGhhdmluZyB0aGUgeSBkaXNhcHBlYXIuXHJcbiAgICAqL1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgaWYgKGFuaVNldHRpbmdzLmdyYXBoT3B0LmhpZGVFcXVhdGlvbikge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuY3NzKFwiYW5pbWF0aW9uXCIsIGB0ZXh0RGlzYXBwZWFyICR7YW5pRHVyYXRpb24qMC41fXMgZWFzZS1pbi1vdXRgKVxyXG4gICAgICAgICAgICAgICAgLm9uZShcImFuaW1hdGlvbmVuZFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93RXZhbHVhdGVFcXUoYW5pU2V0dGluZ3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qXHJcbiAgICBHZXQgdGhlIHkgYW5zd2VyIGFuZCB0aGUgeC1jaGFuZ2VkIGVxdWF0aW9uXHJcbiAgICAqL1xyXG4gICAgdmFyIHBvaW50RGF0YSA9IGFuaVNldHRpbmdzLmRhdGFwb2ludHNbYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kXSxcclxuICAgICAgICBjaGFuZ2VFcXUgPSBwb2ludERhdGEuY2hhbmdlRXF1O1xyXG5cclxuICAgIC8qXHJcbiAgICBTaG93IHRoZSBuZXcgZXF1YXRpb24gd2l0aCB0aGUgcmVwbGFjZWQgeC12YWx1ZSBlcXVhdGlvblxyXG4gICAgKi9cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIGlmIChhbmlTZXR0aW5ncy5ncmFwaE9wdC5oaWRlRXF1YXRpb24pIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAga2F0ZXgucmVuZGVyKGAke2NoYW5nZUVxdX1gLCBlcXVQYXJhKTtcclxuICAgICAgICAgICAgJChlcXVQYXJhKVxyXG4gICAgICAgICAgICAgICAgLmNzcyhcImFuaW1hdGlvblwiLCBgdGV4dEFwcGVhciAke2FuaUR1cmF0aW9uKjAuNX1zIGVhc2UtaW4tb3V0YClcclxuICAgICAgICAgICAgICAgIC5vbmUoXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVxdVBhcmEpLmNzcyhcIm9wYWNpdHlcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93WUFucyhhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLypcclxuICAgIEdldCB0aGUgY3VycmVudCByb3VuZCBhbmQgY3VycmVudCBkYXRhIHBvaW50c1xyXG4gICAgKi9cclxuICAgIHZhciBwb2ludERhdGEgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF07XHJcblxyXG4gICAgLypcclxuICAgIEFuaW1hdGUgdGhlIG5ldyB5IHZhbHVlIHRvIHRoZSBjb29yZGluYXRlZCB5IGNvbHVtbiBhbmQgb25jZVxyXG4gICAgYW5pbWF0aW9uIGlzIGRvbmUgdGhlbiByZXR1cm4gdGhlIHByb21pc2VcclxuICAgICovXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICBpZiAoYW5pU2V0dGluZ3MuZ3JhcGhPcHQuaGlkZUVxdWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgICAgIC5jc3MoXCJhbmltYXRpb25cIiwgYHRleHREaXNhcHBlYXIgJHthbmlEdXJhdGlvbiowLjV9cyBlYXNlLWluLW91dGApXHJcbiAgICAgICAgICAgICAgICAub25lKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVxdVBhcmEpLmNzcyhcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAga2F0ZXgucmVuZGVyKGAke3BvaW50RGF0YS55fWAsIGVxdVBhcmEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcblNob3cgdGhlIGNob3NlbiBlcXVhdGlvbiB0byBncmFwaFxyXG4qL1xyXG5mdW5jdGlvbiBzaG93RXF1YXRpb25BZ2FpbihhbmlTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgaWYgKGFuaVNldHRpbmdzLmdyYXBoT3B0LmhpZGVFcXVhdGlvbikge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuY3NzKFwiYW5pbWF0aW9uXCIsIGB0ZXh0QXBwZWFyICR7YW5pRHVyYXRpb24qMC41fXMgZWFzZS1pbi1vdXRgKVxyXG4gICAgICAgICAgICAgICAgLm9uZShcImFuaW1hdGlvbmVuZFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5PbmNlIHRoZSB5LXZhbHVlIGFwcGVhcnMgaW4gdGhlIGNvcnJlY3QgeS1jb2x1bW4gdGhlbiBmdWxmaWxsIHRoZSBwcm9taXNlLlxyXG4qL1xyXG5mdW5jdGlvbiBwbGFjZVlWYWx1ZShhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgcG9pbnREYXRhID0gYW5pU2V0dGluZ3MuZGF0YXBvaW50c1thbmlTZXR0aW5ncy5jdXJyZW50Um91bmRdO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgdmFyIGlucHV0ID0gJChgdGQjeXZhbCR7cG9pbnREYXRhLmlkICsgMX1gKVswXTtcclxuICAgICAgICAkKGlucHV0KS5odG1sKFwiXCIpO1xyXG4gICAgICAgICQoaW5wdXQpLmFwcGVuZChgPHA+JHtwb2ludERhdGEueX08L3A+YCk7XHJcbiAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuT25jZSB0aGUgZXF1YXRpb24gaXMgY2xlYXJlZCBhbmQgcmVzZXQgdG8gdGhlIGRlZmF1bHQgZXF1YXRpb25cclxudGhlbiBmdWxmaWxsIHRoZSBwcm9taXNlXHJcbiovXHJcbmZ1bmN0aW9uIHJlc2V0Um91bmQoYW5pU2V0dGluZ3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vICAgIHZhciBwb2ludERhdGEgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF07XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgaWYgKGFuaVNldHRpbmdzLmdyYXBoT3B0LmhpZGVFcXVhdGlvbikge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuY3NzKFwiYW5pbWF0aW9uXCIsIGB0ZXh0RGlzYXBwZWFyICR7YW5pRHVyYXRpb24qMC4xNX1zIGVhc2UtaW4tb3V0YClcclxuICAgICAgICAgICAgICAgIC5vbmUoXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVxdVBhcmEpLmNzcyhcIm9wYWNpdHlcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAga2F0ZXgucmVuZGVyKGAke3Byb2ZPcHQubGF0ZXh9YCwgZXF1UGFyYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuUmV0dXJuIHRvIGRlZmF1bHQgYmVnaW5uaW5nIGVxdWF0aW9uIGZvciB0aGUgbmV4dCBhbmltYXRpb24gb3IgZm9yIHRoZSBlbmRcclxuKi9cclxuZnVuY3Rpb24gc2hvd0RlZmF1bHRFcXUoYW5pU2V0dGluZ3MpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIGlmIChhbmlTZXR0aW5ncy5ncmFwaE9wdC5oaWRlRXF1YXRpb24pIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJChlcXVQYXJhKVxyXG4gICAgICAgICAgICAgICAgLmNzcyhcImFuaW1hdGlvblwiLCBgdGV4dEFwcGVhciAke2FuaUR1cmF0aW9uKjAuMTV9cyBlYXNlLWluLW91dGApXHJcbiAgICAgICAgICAgICAgICAub25lKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlcXVQYXJhKS5jc3MoXCJvcGFjaXR5XCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbkFjY2VwdCB0aGUgZGF0YXBvaW50IGFuZCBpdHMgaXRlcmF0b3IgYW5kIHBsb3QgdGhhdCBwb2ludCBiZWluZyBwYXNzZWQgdGhyb3VnaFxyXG4qL1xyXG5mdW5jdGlvbiBwbG90dGVyKGFuaVNldHRpbmdzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIHBsb3RHcmFwaC51cGRhdGUoYW5pU2V0dGluZ3MsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuVGhpcyBmdW5jdGlvbiBhY3RzIGFzIGFuIGl0ZXJhdG9yIHNvIHRoYXQgdGhlIHByb21pc2UgY2hhaW4ga25vd3Mgd2hpY2hcclxuZGF0YXBvaW50IHRvIGhhbmRsZSBhbmQgdG8gYW5pbWF0ZVxyXG4qL1xyXG5mdW5jdGlvbiB1cGRhdGVSb3VuZChhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIHBsYWNlaG9sZGVyID0gYW5pU2V0dGluZ3MuZGF0YXBvaW50c1thbmlTZXR0aW5ncy5jdXJyZW50Um91bmRdO1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIGFuaVNldHRpbmdzLmN1cnJlbnRSb3VuZCArPSAxO1xyXG4gICAgICAgIHBsYWNlaG9sZGVyLnVwZGF0ZVBvaW50ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vKlxyXG5Ud28gZnVuY3Rpb25zIGluIG9yZGVyIHRvIHJlcGxhY2UgdGhlIGZ1bmN0aW9uIG1hY2hpbmUgZ2lmIHdpdGggdGhlIGFuaW1hdGVkXHJcbmdpZiBhbmQgYmFja3dhcmRzLlxyXG4qL1xyXG5mdW5jdGlvbiBhbmltYXRlRnVuY01hY2hpbmUoYW5pU2V0dGluZ3MpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICQoXCIjZnVuY3Rpb25NYWNoaW5lXCIpLmNzcyh7XHJcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1pbWFnZVwiOiBcInVybCguL2ltZy9mdW5jdGlvbk1hY2hpbmVBbmkuZ2lmKVwiXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0b3BBbmlGdW5jTWFjaGluZShhbmlTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgJChcIiNmdW5jdGlvbk1hY2hpbmVcIikuY3NzKHtcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWltYWdlXCI6IFwidXJsKC4vaW1nL2Z1bmN0aW9uTWFjaGluZVN0aWxsLmdpZilcIlxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncylcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5BIGZ1bmN0aW9uIHRvIHNob3cgdGhlIHkgYW5zd2VyIGxlYXZpbmcgdGhlIGZ1bmN0aW9uIG1hY2hpbmUgdG9cclxuc3RhcnQgdGhlIG5leHQgYW5pbWF0aW9uIG9mIGdvaW5nIGJhY2sgdG8gdGhlIHkgY29sdW1uLlxyXG4qL1xyXG5mdW5jdGlvbiBtaW5pQW5pKGFuaVNldHRpbmdzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuXHJcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gYW5pU2V0dGluZ3MuZGF0YXBvaW50c1thbmlTZXR0aW5ncy5jdXJyZW50Um91bmRdLFxyXG4gICAgICAgICAgICB5dmFsdWUgPSBwbGFjZWhvbGRlci55LFxyXG4gICAgICAgICAgICBwYXJhID0gJChgPHA+JHt5dmFsdWV9PC9wPmApO1xyXG5cclxuICAgICAgICAkKHBhcmEpLmNzcyh7XHJcbiAgICAgICAgICAgIFwiZm9udFNpemVcIjogXCIyMHB4XCJcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQocGFyYSk7XHJcblxyXG4gICAgICAgIHBhcmFcclxuICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IDYzMCxcclxuICAgICAgICAgICAgICAgIHRvcDogMTYwXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgICAgICB0b3A6IDIwMFxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwibm9uZVwiXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5BIHByb21pc2UgY2hhaW4gdG8gcnVuIHRocm91Z2ggdGhlIHdob2xlIGFuaW1hdGlvbiBwcm9jZXNzXHJcblxyXG5OT1RFXHJcbkEgcHJvbWlzZSBjaGFpbiBoYXMgYmVlbiB1dGl6aWxlZCBpbiBvcmRlciB0byBlYXNpbHkgcGx1Z2luXHJcbmV4dHJhIGZ1bmN0aW9ucyB0aGF0IHdvdWxkIGJlIGdyZWF0IHRvIGhhdmUgaW4gdGhlIGFuaW1hdGlvblxyXG5wcm9jZXNzLiAgQSBwcm9taXNlIGNoYWluIGhhcyBhbHNvIGJlZW4gdXNlZCBpbiBvcmRlciB0byB3YWl0XHJcbmZvciBhIGFuaW1hdGlvbiB0byBlbmQgdG8gc3RhcnQgdGhlIG5leHQgYW5pbWF0aW9uLlxyXG4qL1xyXG5cclxuLypcclxuRGVmYXVsdCBQcm9taXNlIENoYWluXHJcbiovXHJcbmZ1bmN0aW9uIGFuaVByb21pc2VDaGFpbihkcHMsIGNoYWluKSB7XHJcblxyXG4gICAgZHBzLmRhdGFwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoZGF0YXBvaW50KSB7XHJcbiAgICAgICAgaWYgKGRhdGFwb2ludC51cGRhdGVQb2ludCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjaGFpbiA9IGNoYWluXHJcbiAgICAgICAgICAgICAgICAudGhlbihydW5BbmltYXRpb24oXCJ4VG9NYWNoaW5lXCIsIGRhdGFwb2ludC54KSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGFuaW1hdGVGdW5jTWFjaGluZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHN0YXR1c01lc3NhZ2UoXCJDYWxjdWxhdGluZ1wiKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlcGxhY2VYRXF1KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc2hvd0V2YWx1YXRlRXF1KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc2hvd1lBbnMpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzaG93RXF1YXRpb25BZ2FpbilcclxuICAgICAgICAgICAgICAgIC50aGVuKHN0b3BBbmlGdW5jTWFjaGluZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHN0YXR1c01lc3NhZ2UoXCJcIikpXHJcbiAgICAgICAgICAgICAgICAudGhlbihtaW5pQW5pKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocnVuQW5pbWF0aW9uKFwibWFjaGluZVRvWVwiLCBkYXRhcG9pbnQueSkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihwbGFjZVlWYWx1ZSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJ1bkFuaW1hdGlvbihcInlUb1N0YXR1c0JhclwiLCBgKCR7ZGF0YXBvaW50Lnh9LCR7ZGF0YXBvaW50Lnl9KWApKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShgUGxvdHRpbmcgKCR7ZGF0YXBvaW50Lnh9LCR7ZGF0YXBvaW50Lnl9KWApKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocGxvdHRlcilcclxuICAgICAgICAgICAgICAgIC50aGVuKHN0YXR1c01lc3NhZ2UoYGApKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzZXRSb3VuZClcclxuICAgICAgICAgICAgICAgIC50aGVuKHNob3dEZWZhdWx0RXF1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhaW4gPSBjaGFpbi50aGVuKHVwZGF0ZVJvdW5kKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5JZiB0aGUgXCJIaWRlIEFuaW1hdGlvblwiIGNoZWNrYm94IGlzIGNoZWNrZWQgdGhlbiBza2lwIHRoZSB3aG9sZSBhbmltYXRpb25cclxucHJvbWlzZSBjaGFpbiBhbmQganVzdCBhcHBlbmQgdGhlIHkgdmFsdWVzXHJcbiovXHJcbmZ1bmN0aW9uIGFuaW1hdGVIaWRlKGRwcywgY2hhaW4pIHtcclxuXHJcbiAgICBkcHMuZGF0YXBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhcG9pbnQpIHtcclxuICAgICAgICBpZiAoZGF0YXBvaW50LnVwZGF0ZVBvaW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNoYWluID0gY2hhaW5cclxuICAgICAgICAgICAgICAgIC50aGVuKHBsYWNlWVZhbHVlKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShgUGxvdHRpbmcgKCR7ZGF0YXBvaW50Lnh9LCR7ZGF0YXBvaW50Lnl9KWApKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocGxvdHRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYWluID0gY2hhaW4udGhlbih1cGRhdGVSb3VuZCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuSGFuZGxlIGFsbCBDU1MgYW5pbWF0aW9ucyBieSBjcmVhdGluZyBhIFByb21pc2UgY2hhaW4gdGhyb3VnaCBhIGZvciBsb29wLlxyXG4qL1xyXG5mdW5jdGlvbiBhbmltYXRvckNvbnRyb2woZHBzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgbnVtQ29udGFpbmVyID0gJChcIiNudW1Db250YWluZXJcIiksXHJcbiAgICAgICAgY2hhaW4gPSBQcm9taXNlLnJlc29sdmUoZHBzKTtcclxuXHJcbiAgICBudW1Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgICBpZiAoYW5pRHVyYXRpb24gPT09IDAuNSkge1xyXG4gICAgICAgIGFuaW1hdGVIaWRlKGRwcywgY2hhaW4pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBhbmlQcm9taXNlQ2hhaW4oZHBzLCBjaGFpbik7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIi8qXHJcblNldCB1cCB0aGUgYmFzaWMgdmFyaWFibGVzLlxyXG4qL1xyXG52YXIgeE1lbW9yeSA9IFtdLFxyXG4gICAgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W3R5cGU9J251bWJlciddXCIpLFxyXG4gICAgaW5wdXRDb3VudCA9IGlucHV0cy5sZW5ndGgsXHJcbiAgICBydW5NYXN0ZXIgPSB0cnVlLFxyXG4gICAgcnVuID0gdHJ1ZTtcclxuXHJcbi8qXHJcbkF0dGFjaCBhbiBvbmlucHV0IGV2ZW50IHRvIGFsbCB0aGUgaW5wdXQgYm94ZXMgaW4gb3JkZXIgdG8gdmFsaWRhdGUgdGhlbSB3aXRoaW4gdGhlIGJvdW5kc1xyXG50aGF0IHRoZSBwcm9mZXNzb3IgaGFzIGNob3Nlbi4gIElmIHRoZSBib3VuZHMgYXJlIGV4Y2VlZGVkLCB0aGVuIGRpc2FibGUgdGhlIFwiR28hXCIgYnV0dG9uXHJcbmFuZCBvdXRwdXQgYSBtZXNzYWdlIHRvIHRoZSBzdGF0dXMgYmFyLlxyXG4qL1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgIGlucHV0c1tpXS5vbmtleXVwID0gZSA9PiB7XHJcblxyXG4gICAgICAgIHZhciB4SW5wdXRWYWwgPSBlLnNyY0VsZW1lbnQudmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChlLndoaWNoID09PSA2OSkge1xyXG4gICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICQoXCIjc3RhdHVzIHBcIikuaHRtbChgQ2FuJ3QgZG8gdGhhdCBicm8hYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuLypcclxuRnVuY3Rpb24gdG8gc2VsZWN0IHRoZSBjaG9zZW4gZXF1YXRpb24gd2l0aCBpdHMgbmFtZSBhbmQgZ3JhcGggd2luZG93IGJvdW5kYXJpZXMuXHJcbiovXHJcbmZ1bmN0aW9uIGNoZWNrQ29uZmlnKHZhbCkge1xyXG4gICAgdmFyIHByb2ZPcHQ7XHJcbiAgICAkLmVhY2gocHJvZmVzc29yQ29uZmlnRmlsZSwgZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICBpZiAoaXRlbS5lcXVhdGlvbiA9PT0gdmFsKSB7XHJcbiAgICAgICAgICAgIHByb2ZPcHQgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gcHJvZk9wdDtcclxufVxyXG5cclxuLypcclxuVXBvbiBjaG9vc2luZyBhbm90aGVyIGVxdWF0aW9uIHRvIGdyYXBoLCBjbGVhciBhbGwgdGhlIHZhbHVlc1xyXG4qL1xyXG5mdW5jdGlvbiBjbGVhclZhbHVlcygpIHtcclxuICAgIHZhciB4aW5wdXRzID0gJChcImlucHV0W3R5cGU9J251bWJlciddXCIpLFxyXG4gICAgICAgIHlpbnB1dHMgPSAkKGB0ciB0ZDpudGgtb2YtdHlwZSgyKWApO1xyXG5cclxuICAgIHhpbnB1dHMuZWFjaChmdW5jdGlvbiAoaSwgaXRlbSkge1xyXG4gICAgICAgIGl0ZW0udmFsdWUgPSBcIlwiO1xyXG4gICAgfSk7XHJcblxyXG4gICAgeWlucHV0cy5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgaXRlbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbkRpcHNsYXkgS2F0ZXggZXF1YXRpb24uIEFMU08gdXNlZCBpbiBhamF4LmpzXHJcbiovXHJcbmZ1bmN0aW9uIGNoYW5nZVBsb3QodmFsKSB7XHJcblxyXG4gICAgeE1lbW9yeSA9IFtdO1xyXG5cclxuICAgIGNsZWFyVmFsdWVzKCk7XHJcblxyXG4gICAgd2luZG93LnByb2ZPcHQgPSBjaGVja0NvbmZpZyh2YWwpO1xyXG5cclxuICAgIHZhciBlcXVhdCA9IHZhbCxcclxuICAgICAgICBlcXVQYXJhID0gJChcIiNmdW5jdGlvbk1hY2hpbmUgI2VxdVwiKVswXTtcclxuXHJcbiAgICAkKGVxdVBhcmEpLmVtcHR5KCk7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5wcm9mT3B0LmhpZGVFcXVhdGlvbiA9PT0gZmFsc2UpIHtcclxuICAgICAgICBrYXRleC5yZW5kZXIod2luZG93LnByb2ZPcHQubGF0ZXgsIGVxdVBhcmEpO1xyXG4gICAgfSBlbHNlIGlmICh3aW5kb3cucHJvZk9wdC5oaWRlRXF1YXRpb24gPT09IHRydWUpIHtcclxuICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCI8aDI+TXlzdGVyeSBFcXVhdGlvbjwvaDI+XCIpXHJcbiAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJwYWRkaW5nVG9wXCI6IFwiNXB4XCIsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG5BbmltYXRpb24gcGF0aCBmb3IgdGhlIHN0YWlyc3RlcFxyXG4qL1xyXG5mdW5jdGlvbiBzdGFpclN0ZXAob3B0aW9ucykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgaGlnaHdheVBhdGggPSAyODAsXHJcbiAgICAgICAgbGFzdFNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoIC0gMV07XHJcbiAgICBsYXN0U2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyAke29wdGlvbnMubmFtZX0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCUge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke29wdGlvbnMuc3RhcnRUb3BPZmZ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtvcHRpb25zLnN0YXJ0TGVmdE9mZn1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEwJSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDMzJSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke29wdGlvbnMuc3RhcnRUb3BPZmZ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtoaWdod2F5UGF0aH1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDY2JSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke29wdGlvbnMuZW5kVG9wT2ZmfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7aGlnaHdheVBhdGh9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA5MCUge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxMDAlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJHtvcHRpb25zLmVuZFRvcE9mZn1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke29wdGlvbnMuZW5kTGVmdE9mZn1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfWAsIGxhc3RTaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xyXG59XHJcblxyXG4vKlxyXG5BIHNldCBvZiBmdW5jdGlvbnMgdXNpbmcgdGhlIHN0YWlyc3RlcCBhbmltYXRpb24gdGVtcGxhdGVcclxudG8gY3JlYXRlIHBhdGh3YXlzIHdpdGggY29vcmRpbmF0ZSBkYXRhXHJcbiovXHJcbmZ1bmN0aW9uIG1ha2VYVG9NYWNoaW5lKGlucHV0Q29yZHMsIGluZGV4KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHN0YWlyU3RlcCh7XHJcbiAgICAgICAgc3RhcnRUb3BPZmY6IGlucHV0Q29yZHMudG9wICsgMTAsXHJcbiAgICAgICAgc3RhcnRMZWZ0T2ZmOiBpbnB1dENvcmRzLmxlZnQgKyAzMCxcclxuICAgICAgICBlbmRUb3BPZmY6IDE1MCxcclxuICAgICAgICBlbmRMZWZ0T2ZmOiA0NTAsXHJcbiAgICAgICAgbmFtZTogYHhUb01hY2hpbmUke2luZGV4fWBcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlTWFjaGluZVRvWShpbnB1dENvcmRzLCBpbmRleCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBzdGFpclN0ZXAoe1xyXG4gICAgICAgIHN0YXJ0VG9wT2ZmOiAyMDAsXHJcbiAgICAgICAgc3RhcnRMZWZ0T2ZmOiA2MzAsXHJcbiAgICAgICAgZW5kVG9wT2ZmOiBpbnB1dENvcmRzLnRvcCArIDEwLFxyXG4gICAgICAgIGVuZExlZnRPZmY6IGlucHV0Q29yZHMucmlnaHQgKyA1LFxyXG4gICAgICAgIG5hbWU6IGBtYWNoaW5lVG9ZJHtpbmRleH1gXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWFrZVlUb1N0YXR1c0JhcihpbnB1dENvcmRzLCBpbmRleCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBzdGFpclN0ZXAoe1xyXG4gICAgICAgIHN0YXJ0VG9wT2ZmOiBpbnB1dENvcmRzLnRvcCArIDUsXHJcbiAgICAgICAgc3RhcnRMZWZ0T2ZmOiBpbnB1dENvcmRzLnJpZ2h0ICsgMTAsXHJcbiAgICAgICAgZW5kVG9wT2ZmOiA1MCxcclxuICAgICAgICBlbmRMZWZ0T2ZmOiA0MDAsXHJcbiAgICAgICAgbmFtZTogYHlUb1N0YXR1c0JhciR7aW5kZXh9YFxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcblNldCB1cCB0aGUgeE1lbW9yeSBhcnJheSBhbmQgdGhlIGFuaW1hdGlvbiBwYXRocyBmb3IgZWFjaCBpbnB1dCBib3guXHJcblxyXG5OT1RFOiBTZXR0aW5nIHVwIHRoZSB4TWVtb3J5IGFycmF5IGFsc28gbWFrZXMgaXQgc28gdGhhdCBubyBhbmltYXRpb25zXHJcbiAgICAgIGFyZSByZXBlYXRlZCBieSBtdWx0aXBsZSBjbGlja3Mgb24gdGhlIFwiR28hXCIgYnV0dG9uLlxyXG4qL1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Q291bnQ7IGkrKykge1xyXG4gICAgeE1lbW9yeVtpXSA9IG51bGw7XHJcblxyXG4gICAgdmFyIGlucHV0Q29vciA9IGlucHV0c1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBtYWtlWFRvTWFjaGluZShpbnB1dENvb3IsIGkpO1xyXG4gICAgbWFrZU1hY2hpbmVUb1koaW5wdXRDb29yLCBpKTtcclxuICAgIG1ha2VZVG9TdGF0dXNCYXIoaW5wdXRDb29yLCBpKTtcclxuICAgICQoXCIjbnVtQ29udGFpbmVyXCIpLmFwcGVuZCgkKGA8cD48L3A+YCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBVc2VyRXhjZXB0aW9uKG1lc3NhZ2UsIGVycm9yTnVtKSB7XHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgdGhpcy5lcnJvck51bSA9IGVycm9yTnVtO1xyXG4gICAgdGhpcy5uYW1lID0gXCJVc2VyRXhjZXB0aW9uXCI7XHJcbn1cclxuXHJcbi8qXHJcblNldCB1cCB0aGUgb2JqZWN0IHRoYXQgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCB0aGUgcHJvbWlzZSBjaGFpblxyXG5pbiBhbmltYXRvciBjb250cm9sLlxyXG4qL1xyXG5mdW5jdGlvbiBzZXRVcE9iamVjdCh4aW5wdXRzLCBncmFwaE9wdCwgYW5pU2V0dGluZ3MpIHtcclxuICAgIHhpbnB1dHMuZWFjaChmdW5jdGlvbiAoaSkge1xyXG5cclxuICAgICAgICB2YXIgeHZhbHVlID0gJCh0aGlzKS52YWwoKSxcclxuICAgICAgICAgICAgeHZhbCxcclxuICAgICAgICAgICAgcm91bmRpdDtcclxuXHJcbiAgICAgICAgaWYgKHh2YWx1ZSkge1xyXG4gICAgICAgICAgICB4dmFsID0gK3h2YWx1ZTtcclxuICAgICAgICAgICAgcm91bmRpdCA9IHh2YWwudG9GaXhlZChwcm9mT3B0LnJvdW5kaW5nKTtcclxuXHJcbiAgICAgICAgICAgICQodGhpcykudmFsKHJvdW5kaXQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb2ZPcHQudmlldy54Lm1pbiA8PSByb3VuZGl0ICYmIHJvdW5kaXQgPD0gcHJvZk9wdC52aWV3LngubWF4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJlcGxhY2VYID0gZ3JhcGhPcHQuZXF1YXRpb24ucmVwbGFjZSgveC9nLCBgKCR7cm91bmRpdH0pYCksXHJcbiAgICAgICAgICAgICAgICAgICAgeXZhbCA9IG1hdGguZXZhbChyZXBsYWNlWCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB5dmFsID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0Q29vciA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogcm91bmRpdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHl2YWwudG9GaXhlZChwcm9mT3B0LnJvdW5kaW5nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlRXF1OiBwcm9mT3B0LmxhdGV4LnJlcGxhY2UoXCJ4XCIsIGAoJHtyb3VuZGl0fSlgKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVBvaW50OiB4TWVtb3J5W2ldICE9PSByb3VuZGl0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJChcIiNudW1Db250YWluZXIgcFwiKS5nZXQoaSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFVzZXJFeGNlcHRpb24oXCJvdXQgb2YgZG9tYWluXCIsIHh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEluZmluaXR5ID09PSB5dmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFVzZXJFeGNlcHRpb24oXCJ1bmRlZmluZWQgdmFsdWVcIiwgeHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgQ2xlYXIgb3V0IHRoZSBZcyB3aGVuIHRoZXkgZG9uJ3QgZXF1YWwgZWFjaCBvdGhlciBhbmQgbmVlZCB0byBiZSB1cGRhdGVkXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvaW50LnVwZGF0ZVBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChgdGQjeXZhbCR7aSArIDF9YCkuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKlVwZGF0ZSB0aGUgeG1lbW9yeSovXHJcbiAgICAgICAgICAgICAgICB4TWVtb3J5W2ldID0gcm91bmRpdDtcclxuICAgICAgICAgICAgICAgIGFuaVNldHRpbmdzLmRhdGFwb2ludHMucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVXNlckV4Y2VwdGlvbihcIm91dCBvZiB3aW5kb3dcIiwgeHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5TZXQgYWxsIHRoZSBkYXRhIHRoYXQgd2lsbCBiZSBzZXQgdG8gYW5pU2V0dGluZ3MgaW4gdGhlIHNldFVwT2JqZWN0IGZ1bmN0aW9uXHJcblxyXG5OT1RFXHJcbmdyYXBoT3B0LmNhbGxiYWNrIHN0aWxsIG5lZWRzIGEgdmlhYmxlIG1ldGhvZCFcclxuKi9cclxuZnVuY3Rpb24gc3RhcnRGdW5jTWFjaCgpIHtcclxuXHJcbiAgICB2YXIgeGlucHV0cyA9ICQoXCJpbnB1dFt0eXBlPSdudW1iZXInXVwiKSxcclxuICAgICAgICBncmFwaE9wdCA9IHtcclxuICAgICAgICAgICAgZXF1YXRpb246IHByb2ZPcHQuZXF1YXRpb24sXHJcbiAgICAgICAgICAgIGhpZGVFcXVhdGlvbjogcHJvZk9wdC5oaWRlRXF1YXRpb24sXHJcbiAgICAgICAgICAgIHZpZXc6IHByb2ZPcHQudmlldyxcclxuICAgICAgICAgICAgZHVyYXRpb246IGFuaUR1cmF0aW9uXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhbmlTZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgZGF0YXBvaW50czogW10sXHJcbiAgICAgICAgICAgIGN1cnJlbnRSb3VuZDogMCxcclxuICAgICAgICAgICAgZ3JhcGhPcHQ6IGdyYXBoT3B0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHNldFVwT2JqZWN0KHhpbnB1dHMsIGdyYXBoT3B0LCBhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgYW5pbWF0b3JDb250cm9sKGFuaVNldHRpbmdzKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICB4TWVtb3J5ID0gW107XHJcbiAgICAgICAgJChcIiNzdGF0dXMgcFwiKVxyXG4gICAgICAgICAgICAuaHRtbChgJHtlLmVycm9yTnVtfSB4LXZhbHVlICR7ZS5tZXNzYWdlfS5gKVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgIFwiZm9udFdlaWdodFwiOiBcImJvbGRcIixcclxuICAgICAgICAgICAgICAgIFwiY29sb3JcIjogXCIjYjYyNzI3XCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qQmVmb3JlIHJ1bm5pbmcgdGhlIGZ1bmN0aW9uIG1hY2hpbmUsIHB1dCBhbGwgaW5wdXRzIG5leHQgdG8gZWFjaCBvdGhlci4qL1xyXG5mdW5jdGlvbiBjbGVhbklucHV0cygpIHtcclxuICAgIHZhciB4aW5wdXRzID0gJChcImlucHV0W3R5cGU9J251bWJlciddXCIpLFxyXG4gICAgICAgIGlucHV0QXJyYXkgPSBbXTtcclxuXHJcbiAgICB4aW5wdXRzLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICB2YXIgaW5wdXRWYWx1ZSA9ICQodGhpcykudmFsKCk7XHJcblxyXG4gICAgICAgIGlmIChpbnB1dFZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGlucHV0QXJyYXkucHVzaChpbnB1dFZhbHVlKTtcclxuICAgICAgICAgICAgJCh0aGlzKS52YWwoXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB4aW5wdXRzLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICBpZiAoaSA8IGlucHV0QXJyYXkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykudmFsKGlucHV0QXJyYXlbaV0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQodGhpcykudmFsKFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbiQoXCIjY2xvc2VIZWxwXCIpLmNsaWNrKGUgPT4ge1xyXG4gICAgJChlLnRhcmdldC5wYXJlbnRFbGVtZW50KS5mYWRlT3V0KDEwMCk7XHJcbiAgICAkKFwiI3NoYWRlXCIpLmZhZGVPdXQoMjAwKTtcclxuICAgIGxvY2FsU3RvcmFnZVsnZmlyc3RUaW1lRnVuY3Rpb25NYWNoaW5lJ10gPSBmYWxzZTtcclxufSk7XHJcblxyXG4kKFwiI29wZW5IZWxwXCIpLmNsaWNrKGUgPT4ge1xyXG4gICAgJChcIiNpbnN0cnVjdGlvbnNcIikuZmFkZUluKDEwMCk7XHJcbiAgICAkKFwiI3NoYWRlXCIpLmZhZGVJbigxMDAwKTtcclxufSk7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShlID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIGZpcnN0dGltZSA9IGxvY2FsU3RvcmFnZVsnZmlyc3RUaW1lRnVuY3Rpb25NYWNoaW5lJ107XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgIH1cclxuICAgIGlmIChmaXJzdHRpbWUgPT09IFwiZmFsc2VcIikge1xyXG4gICAgICAgICQoXCIjaW5zdHJ1Y3Rpb25zXCIpLmhpZGUoKTtcclxuICAgICAgICAkKFwiI3NoYWRlXCIpLmhpZGUoKTtcclxuICAgIH1cclxufSlcclxuXHJcbi8qXHJcbk9uY2hhbmdlIGV2ZW50IGhhbmRsZXIgZm9yIHRoZSBzZWxlY3QgaHRtbCBlbGVtZW50LlxyXG4qL1xyXG4kKFwic2VsZWN0XCIpLmNoYW5nZShmdW5jdGlvbiAoZSkge1xyXG4gICAgdmFyIHNlbGVjdGVkID0gJChgb3B0aW9uW3ZhbHVlPVwiJHtlLnRhcmdldC52YWx1ZX1cIl1gKSxcclxuICAgICAgICBwcm9mT3B0ID0gSlNPTi5wYXJzZShzZWxlY3RlZC5hdHRyKFwiZGF0YS1wcm9mb3B0XCIpKTtcclxuXHJcbiAgICBwbG90R3JhcGguc2V0dXAocHJvZk9wdCwgXCIjZ3JhcGhcIilcclxuICAgIGNoYW5nZVBsb3QoZS50YXJnZXQudmFsdWUpO1xyXG59KTtcclxuXHJcbi8qXHJcbkRPQ1VNRU5UIGtleWRvd24gZXZlbnQgaGFuZGxlclxyXG4qL1xyXG4kKGRvY3VtZW50KS5rZXlwcmVzcyhmdW5jdGlvbiAoZSkge1xyXG4gICAgaWYgKGUud2hpY2ggPT0gMTMgJiYgcnVuTWFzdGVyKSB7XHJcbiAgICAgICAgY2xlYW5JbnB1dHMoKTtcclxuICAgICAgICBzdGFydEZ1bmNNYWNoKCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLypcclxuR08hIENsaWNrIGV2ZW50IGhhbmRsZXJcclxuKi9cclxuJChcImlucHV0W3R5cGU9J2J1dHRvbiddW3ZhbHVlPSdHbyEnXVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAocnVuTWFzdGVyKSB7XHJcbiAgICAgICAgY2xlYW5JbnB1dHMoKTtcclxuICAgICAgICBzdGFydEZ1bmNNYWNoKCk7XHJcbiAgICB9XHJcbn0pO1xyXG4iXX0=
