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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJwbG90R3JhcGguanMiLCJhamF4LmpzIiwiYW5pbWF0b3Jjb250cm9sLmpzIiwiZXZlbnRzLmpzIl0sIm5hbWVzIjpbInRib2R5IiwiJCIsInRkMSIsInRkMiIsInRyIiwiaW5wdXQiLCJyb3dDb3VudCIsImoiLCJhdHRyIiwiYXBwZW5kIiwicGxvdEdyYXBoIiwiZ3JhcGhMb2NhdGlvblNlbGVjdG9yIiwiZG90TG9jYXRpb24iLCJjdXJyZW50RXF1YXRpb24iLCJmdW5QbG90IiwieFNjYWxlIiwieVNjYWxlIiwiZnJlZUlkIiwidXBkYXRlVGV4dFgiLCJjdXJyZW50UG9pbnQiLCJkIiwiemVybyIsInRvRml4ZWQiLCJ0IiwibG9jYXRpb24iLCJ4IiwidGV4dENvbnRlbnQiLCJ1cGRhdGVUZXh0WSIsInhSb3VuZGVkIiwieVZhbCIsInkiLCJtYWtlUG9pbnRJZCIsIm51bUluIiwibWFrZVBvaW50R3JvdXAiLCJwb2ludEdyb3VwIiwiZDMiLCJzZWxlY3RBbGwiLCJpZCIsInRleHQiLCJ1cGRhdGUiLCJhbmlPcHRpb25zIiwiY2FsbGJhY2siLCJkYXRhcG9pbnRzIiwiY3VycmVudFJvdW5kIiwibGluZUlzUGxvdHRlZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsInRyYW5zaXRpb24iLCJmb3JFYWNoIiwicG9pbnQiLCJ1cGRhdGVQb2ludCIsInNlbGVjdCIsInJlbW92ZSIsImdyYXBoT3B0IiwiZ3JhcGhIaWRlIiwiZHVyYXRpb24iLCJlYXNlIiwidHdlZW4iLCJlYWNoIiwic2V0dXAiLCJzZWxlY3RvciIsIm9wdHNJbiIsImdyYXBoT3B0aW9ucyIsInRhcmdldCIsImRhdGEiLCJmbiIsImVxdWF0aW9uIiwic2tpcFRpcCIsInhBeGlzIiwiZG9tYWluIiwidmlldyIsIm1pbiIsIm1heCIsInlBeGlzIiwiZGlzYWJsZVpvb20iLCJncmlkIiwiYW5ub3RhdGlvbnMiLCJmdW5jdGlvblBsb3QiLCJtZXRhIiwicmVhZHkiLCJzZWFyY2giLCJxdWVyeVZhcnMiLCJwdXNoIiwicXVlcnlTdHJpbmciLCJzdWJzdHJpbmciLCJzcGxpdCIsImFsbFF1ZXJpZXMiLCJxdWVyeSIsInBhaXIiLCJjb25zb2xlIiwibG9nIiwic2hvd1Byb2ZPcHRpb25zIiwicHJvZk9wdCIsImluaXQiLCJzdHJpbmdpZmllZERhdGEiLCJKU09OIiwic3RyaW5naWZ5Iiwib3B0IiwibmFtZSIsInZhbCIsImdldEpTT04iLCJmaWxlIiwicmVzdWx0IiwibG9hZCIsImdlbmVyYWwiLCJodG1sIiwidGl0bGUiLCJpbnN0cnVjdGlvbnMiLCJ3aW5kb3ciLCJwcm9mZXNzb3JDb25maWdGaWxlIiwiZXF1YXRpb25zIiwiaSIsInF1ZXJ5U2VsZWN0b3IiLCJmaXJzdENoaWxkIiwic3R5bGUiLCJkaXNwbGF5IiwiY2xpY2siLCJjaGVja2VkIiwiZSIsImNoYW5nZVBsb3QiLCJmYWlsIiwiZXF1UGFyYSIsInJhbmdlU3BlZWQiLCJhbmlEdXJhdGlvbiIsImNoYW5nZSIsInZhbHVlIiwicnVuQW5pbWF0aW9uIiwiYW5pbWF0aW9uIiwiYW5pU2V0dGluZ3MiLCJkYXRhcG9pbnQiLCJudW1QYXJhIiwiZWxlbWVudCIsIlByb21pc2UiLCJyZXNvbHZlIiwiY3NzIiwib25lIiwic3RhdHVzTWVzc2FnZSIsIm1lc3NhZ2UiLCJzdGF0dXNCYXIiLCJyZXBsYWNlWEVxdSIsImhpZGVFcXVhdGlvbiIsInNob3dFdmFsdWF0ZUVxdSIsInBvaW50RGF0YSIsImNoYW5nZUVxdSIsImthdGV4IiwicmVuZGVyIiwic2hvd1lBbnMiLCJzaG93RXF1YXRpb25BZ2FpbiIsInBsYWNlWVZhbHVlIiwicmVzZXRSb3VuZCIsImxhdGV4Iiwic2hvd0RlZmF1bHRFcXUiLCJwbG90dGVyIiwidXBkYXRlUm91bmQiLCJwbGFjZWhvbGRlciIsImFuaW1hdGVGdW5jTWFjaGluZSIsInN0b3BBbmlGdW5jTWFjaGluZSIsIm1pbmlBbmkiLCJ5dmFsdWUiLCJwYXJhIiwicG9zaXRpb24iLCJvcGFjaXR5IiwibGVmdCIsInRvcCIsImFuaW1hdGUiLCJhbmlQcm9taXNlQ2hhaW4iLCJkcHMiLCJjaGFpbiIsInRoZW4iLCJhbmltYXRlSGlkZSIsImFuaW1hdG9yQ29udHJvbCIsIm51bUNvbnRhaW5lciIsImlubmVySFRNTCIsInhNZW1vcnkiLCJpbnB1dHMiLCJpbnB1dENvdW50IiwicnVuTWFzdGVyIiwicnVuIiwib25rZXl1cCIsInhJbnB1dFZhbCIsInNyY0VsZW1lbnQiLCJ3aGljaCIsImNoZWNrQ29uZmlnIiwiaXRlbSIsImNsZWFyVmFsdWVzIiwieGlucHV0cyIsInlpbnB1dHMiLCJlcXVhdCIsImVtcHR5Iiwic3RhaXJTdGVwIiwib3B0aW9ucyIsImhpZ2h3YXlQYXRoIiwibGFzdFNoZWV0Iiwic3R5bGVTaGVldHMiLCJpbnNlcnRSdWxlIiwic3RhcnRUb3BPZmYiLCJzdGFydExlZnRPZmYiLCJlbmRUb3BPZmYiLCJlbmRMZWZ0T2ZmIiwiY3NzUnVsZXMiLCJtYWtlWFRvTWFjaGluZSIsImlucHV0Q29yZHMiLCJpbmRleCIsIm1ha2VNYWNoaW5lVG9ZIiwicmlnaHQiLCJtYWtlWVRvU3RhdHVzQmFyIiwiaW5wdXRDb29yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiVXNlckV4Y2VwdGlvbiIsImVycm9yTnVtIiwic2V0VXBPYmplY3QiLCJ4dmFsdWUiLCJ4dmFsIiwicm91bmRpdCIsInJvdW5kaW5nIiwicmVwbGFjZVgiLCJyZXBsYWNlIiwieXZhbCIsIm1hdGgiLCJldmFsIiwiZ2V0IiwiSW5maW5pdHkiLCJzdGFydEZ1bmNNYWNoIiwiY2xlYW5JbnB1dHMiLCJpbnB1dEFycmF5IiwiaW5wdXRWYWx1ZSIsInBhcmVudEVsZW1lbnQiLCJmYWRlT3V0IiwibG9jYWxTdG9yYWdlIiwiZmFkZUluIiwiZmlyc3R0aW1lIiwiZXJyb3IiLCJoaWRlIiwic2VsZWN0ZWQiLCJwYXJzZSIsImtleXByZXNzIl0sIm1hcHBpbmdzIjoiOztBQUFDLGFBQVk7QUFDVDs7QUFFQTs7OztBQUdBLFFBQUlBLFFB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QUFWLEVBQWE7QUFDOUIsUUFBSUEsRUFBRStELEtBQUYsSUFBVyxFQUFYLElBQWlCTCxTQUFyQixFQUFnQztBQUM1QitDO0FBQ0FEO0FBQ0g7QUFDSixDQUxEOztBQU9BOzs7QUFHQTlOLEVBQUUsbUNBQUYsRUFBdUNvSCxLQUF2QyxDQUE2QyxZQUFZO0FBQ3JELFFBQUk0RCxTQUFKLEVBQWU7QUFDWCtDO0FBQ0FEO0FBQ0g7QUFDSixDQUxEIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLypcclxuICAgIE1ha2UgdGhlIHdob2xlIHRhYmxlIGFuZCBjZWxscyBmb3IgdGhlIGlucHV0IGJveGVzIGFuZCB1c2VyIGludGVyYWN0aW9uLlxyXG4gICAgKi9cclxuICAgIHZhciB0Ym9keSA9ICQoXCJ0Ym9keVwiKSxcclxuICAgICAgICB0ZDEsXHJcbiAgICAgICAgdGQyLFxyXG4gICAgICAgIHRyLFxyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIHJvd0NvdW50ID0gMTA7XHJcblxyXG4gICAgZm9yICh2YXIgaiA9IDE7IGogPD0gcm93Q291bnQ7IGorKykge1xyXG4gICAgICAgIGlucHV0ID0gJChcIjxpbnB1dD5cIik7XHJcbiAgICAgICAgdGQxID0gJChcIjx0ZD48L3RkPlwiKTtcclxuICAgICAgICB0ZDIgPSAkKFwiPHRkPjwvdGQ+XCIpO1xyXG4gICAgICAgIHRyID0gJChcIjx0cj48L3RyPlwiKTtcclxuXHJcbiAgICAgICAgJCh0cikuYXR0cihcImlkXCIsIGByb3cke2p9YCk7XHJcblxyXG4gICAgICAgICQoaW5wdXQpLmF0dHIoXCJuYW1lXCIsIGBpbnB1dCR7an1gKS5hdHRyKFwidHlwZVwiLCBcIm51bWJlclwiKTtcclxuXHJcbiAgICAgICAgJCh0ZDIpLmF0dHIoXCJpZFwiLCBgeXZhbCR7an1gKTtcclxuXHJcbiAgICAgICAgJCh0ZDEpLmFwcGVuZChpbnB1dCk7XHJcbiAgICAgICAgJCh0cikuYXBwZW5kKHRkMSkuYXBwZW5kKHRkMik7XHJcbiAgICAgICAgJCh0Ym9keSkuYXBwZW5kKHRyKTtcclxuICAgIH1cclxufSgpKTtcclxuIiwiLypqc2xpbnQgcGx1c3BsdXM6IHRydWUsIGJyb3dzZXI6IHRydWUsIGRldmVsOiB0cnVlKi9cclxuLypnbG9iYWwgZDMsIGZ1bmN0aW9uUGxvdCovXHJcbnZhciBwbG90R3JhcGggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICB2YXIgZ3JhcGhMb2NhdGlvblNlbGVjdG9yLFxyXG4gICAgICAgIGRvdExvY2F0aW9uLFxyXG4gICAgICAgIGN1cnJlbnRFcXVhdGlvbixcclxuICAgICAgICBmdW5QbG90LFxyXG4gICAgICAgIHhTY2FsZSxcclxuICAgICAgICB5U2NhbGUsXHJcbiAgICAgICAgZnJlZUlkID0gMDtcclxuXHJcbiAgICAvL3RoZXNlIHR3byBmdW5jdGlvbnMgbWFrZSB0aGUgZmFjdG9yeSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgaW4gdGhlIGFuaW1hdGlvbnMgZm9yIHRoZSBwb2ludCBsYWJlbHNcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRleHRYKGN1cnJlbnRQb2ludCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICB2YXIgemVybyA9ICgwKS50b0ZpeGVkKDIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBjdXJyZW50UG9pbnQueCAqIHQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRDb250ZW50ID0gXCIoIFwiICsgbG9jYXRpb24udG9GaXhlZCgyKSArIFwiLCBcIiArIHplcm8gKyBcIilcIjtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRleHRZKGN1cnJlbnRQb2ludCkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgeFJvdW5kZWQgPSBjdXJyZW50UG9pbnQueCxcclxuICAgICAgICAgICAgICAgIHlWYWwgPSBjdXJyZW50UG9pbnQueTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0Q29udGVudCA9IFwiKCBcIiArIHhSb3VuZGVkICsgXCIsIFwiICsgKHlWYWwgKiB0KS50b0ZpeGVkKDIpICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlUG9pbnRJZChudW1Jbikge1xyXG4gICAgICAgIHJldHVybiAnZ3JhcGhQb2ludCcgKyBudW1JbjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlUG9pbnRHcm91cChjdXJyZW50UG9pbnQpIHtcclxuICAgICAgICB2YXIgcG9pbnRHcm91cCA9IGQzLnNlbGVjdEFsbChkb3RMb2NhdGlvbikuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3BvaW50JylcclxuICAgICAgICAgICAgLmF0dHIoJ2lkJywgbWFrZVBvaW50SWQoY3VycmVudFBvaW50LmlkKSk7XHJcblxyXG4gICAgICAgIC8vYWRkIHRoZSBjaXJjbGVcclxuICAgICAgICBwb2ludEdyb3VwLmFwcGVuZCgnY2lyY2xlJylcclxuICAgICAgICAgICAgLmF0dHIoJ3InLCA0KVxyXG4gICAgICAgICAgICAuYXR0cignY3gnLCAwKVxyXG4gICAgICAgICAgICAuYXR0cignY3knLCAwKTtcclxuXHJcbiAgICAgICAgLy9hZGQgdGhlIGxhYmVsXHJcbiAgICAgICAgcG9pbnRHcm91cC5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAgICAgICAudGV4dCgnKDAsIDApJylcclxuICAgICAgICAgICAgLmF0dHIoJ3gnLCA1KVxyXG4gICAgICAgICAgICAuYXR0cigneScsIDE1KTtcclxuICAgICAgICAvL21vdmUgaXQgdG8gKDAsMClcclxuICAgICAgICBwb2ludEdyb3VwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHhTY2FsZSgwKSArICcgJyArIHlTY2FsZSgwKSArICcpJyk7XHJcbiAgICAgICAgcmV0dXJuIHBvaW50R3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGFuaU9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRQb2ludCA9IGFuaU9wdGlvbnMuZGF0YXBvaW50c1thbmlPcHRpb25zLmN1cnJlbnRSb3VuZF0sXHJcbiAgICAgICAgICAgIGxpbmVJc1Bsb3R0ZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGRvdExvY2F0aW9uICsgJyAuZ3JhcGggLmxpbmUnKS5sZW5ndGggPiAwLFxyXG4gICAgICAgICAgICBwb2ludEdyb3VwLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uO1xyXG5cclxuICAgICAgICAvL2NsZWFyIGFueSBwb2ludHMgdGhhdCB3aWxsIGdldCB1cGRhdGVkXHJcbiAgICAgICAgYW5pT3B0aW9ucy5kYXRhcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKHBvaW50KSB7XHJcbiAgICAgICAgICAgIGlmIChwb2ludC51cGRhdGVQb2ludCkge1xyXG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0KCcjJyArIG1ha2VQb2ludElkKHBvaW50LmlkKSkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9jaGVjayBpZiB3ZSBuZWVkIHRvIGhpZGUgb3Igc2hvdyB0aGUgcGxvdGxpbmVcclxuICAgICAgICBpZiAoYW5pT3B0aW9ucy5ncmFwaE9wdC5ncmFwaEhpZGUpIHtcclxuICAgICAgICAgICAgZDMuc2VsZWN0KGRvdExvY2F0aW9uICsgJyAuZ3JhcGggLmxpbmUnKS5hdHRyKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkMy5zZWxlY3QoZG90TG9jYXRpb24gKyAnIC5ncmFwaCAubGluZScpLmF0dHIoJ2Rpc3BsYXknLCAnaW5saW5lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2RvZXMgdGhlIGN1cnJlbnRSb3VuZCBuZWVkIHRvIGJlIHVwZGF0ZWRlZD9cclxuICAgICAgICBpZiAoIWN1cnJlbnRQb2ludC51cGRhdGVQb2ludCkge1xyXG4gICAgICAgICAgICAvL25vdGhpdG5nIHRvIHNlZSBoZXJlIGp1c3Qga2VlcCBvbiBtb3ZpbmdcclxuICAgICAgICAgICAgY2FsbGJhY2soYW5pT3B0aW9ucyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9kcmF3IHBvaW50XHJcbiAgICAgICAgICAgIHBvaW50R3JvdXAgPSBtYWtlUG9pbnRHcm91cChjdXJyZW50UG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgLy9pcyBhbmltYXRpb24gb24/XHJcbiAgICAgICAgICAgIGlmIChhbmlPcHRpb25zLmdyYXBoT3B0LmR1cmF0aW9uIDw9IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgLy9tb3ZlIGl0IGludG8gcGxhY2Ugd2l0aG91dCBhbmltYXRpb25cclxuICAgICAgICAgICAgICAgIHBvaW50R3JvdXAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeFNjYWxlKGN1cnJlbnRQb2ludC54KSArICcgJyArIHlTY2FsZShjdXJyZW50UG9pbnQueSkgKyAnKScpO1xyXG4gICAgICAgICAgICAgICAgLy91cGRhdGUgdGhlIGxhYmxlXHJcbiAgICAgICAgICAgICAgICBwb2ludEdyb3VwLnNlbGVjdCgndGV4dCcpLnRleHQoJygnICsgY3VycmVudFBvaW50LnggKyAnLCAnICsgY3VycmVudFBvaW50LnkgKyAnKScpO1xyXG4gICAgICAgICAgICAgICAgLy9jYWxsIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhhbmlPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL2RyYXcgcG9pbnQgd2l0aCBhbmltYWlvblxyXG4gICAgICAgICAgICAgICAgLy9GaXJzdCB0cmFuc2l0aW9uIC0gbW92ZSB0aGUgZ3JvdXAgaW4gdGhlIFhcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gPSBwb2ludEdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihhbmlPcHRpb25zLmdyYXBoT3B0LmR1cmF0aW9uICogMTAwMClcclxuICAgICAgICAgICAgICAgICAgICAuZWFzZSgnY3ViaWMtb3V0JylcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeFNjYWxlKGN1cnJlbnRQb2ludC54KSArICcgJyArIHlTY2FsZSgwKSArICcpJyk7XHJcbiAgICAgICAgICAgICAgICAvL3N1YiB0cmFuc2l0aW9uIC0gdXBkYXRlIHRoZSBsYWJlbFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5zZWxlY3QoJ3RleHQnKS50d2VlbigndGV4dCcsIHVwZGF0ZVRleHRYKGN1cnJlbnRQb2ludCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vU2Vjb25kIHRyYW5zaXRpb24gLSBtb3ZlIHRoZSBncm91cCBpbiB0aGUgWVxyXG4gICAgICAgICAgICAgICAgLy9zdWIgdHJhbnNpdGlvbiAtIHVwZGF0ZSB0aGUgbGFiZWxcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24udHJhbnNpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKGFuaU9wdGlvbnMuZ3JhcGhPcHQuZHVyYXRpb24gKiAxMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgIC5lYXNlKCdjdWJpYy1vdXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4U2NhbGUoY3VycmVudFBvaW50LngpICsgJyAnICsgeVNjYWxlKGN1cnJlbnRQb2ludC55KSArICcpJylcclxuICAgICAgICAgICAgICAgICAgICAuZWFjaCgnZW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhhbmlPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZWxlY3QoJ3RleHQnKS50d2VlbigndGV4dCcsIHVwZGF0ZVRleHRZKGN1cnJlbnRQb2ludCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldHVwKGFuaU9wdGlvbnMsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgLy9zdWdhclxyXG4gICAgICAgIHZhciBvcHRzSW4gPSBhbmlPcHRpb25zLmdyYXBoT3B0LFxyXG4gICAgICAgICAgICBncmFwaE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHNlbGVjdG9yLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW3tcclxuICAgICAgICAgICAgICAgICAgICBmbjogb3B0c0luLmVxdWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIHNraXBUaXA6IHRydWVcclxuICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBkb21haW46IFtvcHRzSW4udmlldy54Lm1pbiwgb3B0c0luLnZpZXcueC5tYXhdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBkb21haW46IFtvcHRzSW4udmlldy55Lm1pbiwgb3B0c0luLnZpZXcueS5tYXhdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZVpvb206IHRydWUsXHJcbiAgICAgICAgICAgICAgICBncmlkOiB0cnVlLFxyXG5cdFx0XHRcdGFubm90YXRpb25zOiBbe1xyXG5cdFx0XHRcdFx0eDogMCxcclxuXHRcdFx0XHRcdHRleHQ6ICd5IGF4aXMnXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0eTogMCxcclxuXHRcdFx0XHRcdHRleHQ6ICd4IGF4aXMnXHJcblx0XHRcdFx0fV1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9zYXZlIHNvbWUgdGhpbmdzIGZvciBsYXRlclxyXG4gICAgICAgIGdyYXBoTG9jYXRpb25TZWxlY3RvciA9IHNlbGVjdG9yO1xyXG4gICAgICAgIGRvdExvY2F0aW9uID0gZ3JhcGhMb2NhdGlvblNlbGVjdG9yICsgJyAuY29udGVudCc7XHJcbiAgICAgICAgY3VycmVudEVxdWF0aW9uID0gb3B0c0luLmVxdWF0aW9uO1xyXG5cclxuICAgICAgICAvL21ha2UgdGhlIHBsb3QgYW5kIHNjYWxlc1xyXG4gICAgICAgIGZ1blBsb3QgPSBmdW5jdGlvblBsb3QoZ3JhcGhPcHRpb25zKTtcclxuICAgICAgICB4U2NhbGUgPSBmdW5QbG90Lm1ldGEueFNjYWxlO1xyXG4gICAgICAgIHlTY2FsZSA9IGZ1blBsb3QubWV0YS55U2NhbGU7XHJcblxyXG4gICAgICAgIC8vY2xlYW4gb3V0IGFueSBvbGQgcG9pbnRzIGZpcnN0XHJcbiAgICAgICAgZDMuc2VsZWN0QWxsKGRvdExvY2F0aW9uICsgJyAucG9pbnQnKS5yZW1vdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlLFxyXG4gICAgICAgIHNldHVwOiBzZXR1cFxyXG4gICAgfTtcclxufSgpKTtcclxuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8qXHJcbiAgICBMb2FkIFF1ZXJ5IHN1YnN0cmluZ1xyXG4gICAgKi9cclxuXG4gICAgaWYgKGxvY2F0aW9uLnNlYXJjaCA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIC8vRGVmYXVsdCBxdWVyeSBzdHJpbmcgaWYgbm90aGluZyBwcm92aWRlZFxyXG4gICAgICAgIHZhciBxdWVyeVZhcnMgPSBbXTtcbiAgICAgICAgcXVlcnlWYXJzLnB1c2goXCJmaWxlPWZ1bmNNYWNoaW5lU2V0dGluZ3NcIik7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIC8vIEdyYWIgdGhlIHF1ZXJ5IHN0cmluZyBhbmQgb3B0aW9uc1xyXG4gICAgICAgIHZhciBxdWVyeVZhcnMgPSBbXTtcbiAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgLy8gU2V0IHF1ZXJ5VmFycyB0byBiZSBhcnJheSBvZiBwYXJhbWV0ZXJzXHJcbiAgICAgICAgcXVlcnlWYXJzID0gcXVlcnlTdHJpbmcuc3BsaXQoXCImXCIpO1xyXG5cclxuICAgIH1cclxuICAgIHZhciBhbGxRdWVyaWVzID0ge307XHJcblxyXG4gICAgcXVlcnlWYXJzLmZvckVhY2goZnVuY3Rpb24gKHF1ZXJ5KXtcclxuICAgICAgICB2YXIgcGFpciA9IHF1ZXJ5LnNwbGl0KFwiPVwiKTtcclxuICAgICAgICBhbGxRdWVyaWVzW3BhaXJbMF1dID0gcGFpclsxXTtcclxuICAgIH0pXHJcblxyXG4vLyAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXJ5VmFycy5sZW5ndGg7IGkrKykge1xyXG4vLyAgICAgICAgdmFyIHBhaXIgPSBxdWVyeVZhcnNbaV0uc3BsaXQoXCI9XCIpO1xyXG4vLyAgICAgICAgYWxsUXVlcmllc1twYWlyWzBdXSA9IHBhaXJbMV07XHJcbi8vICAgIH1cclxuY29uc29sZS5sb2cocXVlcnlWYXJzKTtcclxuICAgIGZ1bmN0aW9uIHNob3dQcm9mT3B0aW9ucyhwcm9mT3B0LCBpbml0KSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICBBcHBlbmQgdGhlIHByb2Zlc3NvcidzIGNob3NlbiBlcXVhdGlvbnMgdG8gdGhlIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgdmFyIHN0cmluZ2lmaWVkRGF0YSA9IEpTT04uc3RyaW5naWZ5KGluaXQpLFxyXG4gICAgICAgICAgICBvcHQgPSAkKFwiPG9wdGlvbj48L29wdGlvbj5cIikuYXBwZW5kKHByb2ZPcHQubmFtZSk7XHJcblxyXG4gICAgICAgICQob3B0KVxyXG4gICAgICAgICAgICAudmFsKHByb2ZPcHQuZXF1YXRpb24pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZGF0YS1wcm9mT3B0XCIsIHN0cmluZ2lmaWVkRGF0YSk7XHJcblxyXG4gICAgICAgICQoXCJzZWxlY3RcIilcclxuICAgICAgICAgICAgLmFwcGVuZChvcHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qXHJcbiAgICBMb2FkIHRoZSBwcm9mZXNzb3IgY29uZmlndXJhdGlvbiBmaWxlXHJcblxyXG4gICAgZ2VuZXJhbCBxdWVyeTogP2ZpbGU9ZnVuY01hY2hpbmVTZXR0aW5ncyZsb2FkPWdlbmVyYWxcclxuICAgICovXHJcblxyXG4gICAgJC5nZXRKU09OKGFsbFF1ZXJpZXMuZmlsZSArIFwiLmpzb25cIiwgZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIFwibG9hZFwiIHF1ZXJ5LCBsb2FkIGl0LCBvdGhlcndpc2UgbG9hZCB0aGUgZ2VuZXJhbCBvcHRpb24uXHJcbiAgICAgICAgaWYgKGFsbFF1ZXJpZXMubG9hZCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBkYXRhW2FsbFF1ZXJpZXMubG9hZF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gZGF0YS5nZW5lcmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJChcIiN0aXRsZVwiKS5odG1sKHJlc3VsdC50aXRsZSk7XHJcbiAgICAgICAgJChcIiNpbnN0cnVjdGlvblRleHRcIikuaHRtbChyZXN1bHQuaW5zdHJ1Y3Rpb25zKTtcclxuXHJcbiAgICAgICAgd2luZG93LnByb2Zlc3NvckNvbmZpZ0ZpbGUgPSByZXN1bHQuZXF1YXRpb25zO1xyXG5cclxuICAgICAgICAkLmVhY2gocmVzdWx0LmVxdWF0aW9ucywgZnVuY3Rpb24gKGksIHByb2ZPcHQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbml0ID0ge1xyXG4gICAgICAgICAgICAgICAgZ3JhcGhPcHQ6IHByb2ZPcHRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNob3dQcm9mT3B0aW9ucyhwcm9mT3B0LCBpbml0KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIERpc3BsYXkgdGhlIGRlZmF1bHQgZXF1YXRpb24gdG8gdGhlIGZ1bmN0aW9uIG1hY2hpbmVcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vaW4gZXZlbnRzLmpzXHJcbiAgICAgICAgICAgICAgICBwbG90R3JhcGguc2V0dXAoaW5pdCwgXCIjZ3JhcGhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ncmFwaFwiKS5maXJzdENoaWxkLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAvKkNoZWNrYm94IG9uY2xpY2sgZXZlbnQqL1xyXG4gICAgICAgICAgICAgICAgJChcImlucHV0I3Nob3dHcmFwaFt0eXBlPSdjaGVja2JveCddXCIpLmNsaWNrKGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGVja2VkID0gZS50YXJnZXQuY2hlY2tlZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdyYXBoXCIpLmZpcnN0Q2hpbGQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdyYXBoXCIpLmZpcnN0Q2hpbGQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgY2hhbmdlUGxvdChwcm9mT3B0LmVxdWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pLmZhaWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjc3RhdHVzIHBcIikuYXBwZW5kKFwiQWRkIGEgcXVlcnkgc3RyaW5nXCIpXHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG4iLCJ2YXIgZXF1UGFyYSA9ICQoXCIjZnVuY3Rpb25NYWNoaW5lICNlcXVcIilbMF0sXHJcbiAgICByYW5nZVNwZWVkID0gJChcIiNhbmltYXRlXCIpLnZhbCgpLFxyXG4gICAgYW5pRHVyYXRpb24gPSAoMSAqIDUpIC8gcmFuZ2VTcGVlZDtcclxuXHJcbiQoJyNhbmltYXRlJykuY2hhbmdlKGUgPT4ge1xyXG4gICAgYW5pRHVyYXRpb24gPSAoMSAqIDUpIC8gZS50YXJnZXQudmFsdWU7XHJcbn0pXHJcblxyXG5mdW5jdGlvbiBydW5BbmltYXRpb24obmFtZSwgdmFsdWUpIHtcclxuICAgIC8qXHJcbiAgICBUaGlzIGlzIGEgZnVuY3Rpb24gZmFjdG9yeSB3aGljaCB3aWxsIGdyYWIgdGhlXHJcbiAgICBuZWNlc3NhcnkgZGF0YSBhbmQgdGhlbiByZXR1cm4gdGhlIGZ1bmN0aW9uIHByb21pc2VcclxuICAgICovXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gYW5pbWF0aW9uKGFuaVNldHRpbmdzKSB7XHJcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICAgICAgdmFyIGRhdGFwb2ludCA9IGFuaVNldHRpbmdzLmRhdGFwb2ludHNbYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kXSxcclxuICAgICAgICAgICAgbnVtUGFyYSA9IGRhdGFwb2ludC5lbGVtZW50O1xyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIE1ha2UgdGhlIHByb21pc2UgdGhhdCB3aGVuIHRoZSBkeW5hbWljXHJcbiAgICAgICAgYW5pbWF0aW9uIHBhdGggaXMgZG9uZSB0aGVuIHRoaXMgcHJvbWlzZSBpcyBmaW5pc2hlZFxyXG4gICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgICQobnVtUGFyYSlcclxuICAgICAgICAgICAgICAgIC5odG1sKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJhbmltYXRpb25cIjogYCR7bmFtZX0ke2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZH0gJHthbmlEdXJhdGlvbn1zIGVhc2UtaW4tb3V0YCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub25lKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdGF0dXNNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgLypcclxuICAgIFRoaXMgaXMgYSBmdW5jdGlvbiBmYWN0b3J5IHdoaWNoIHdpbGwgZ3JhYiB0aGVcclxuICAgIG5lY2Vzc2FyeSBkYXRhIGFuZCB0aGVuIHJldHVybiB0aGUgZnVuY3Rpb24gcHJvbWlzZVxyXG4gICAgKi9cclxuICAgIHZhciBzdGF0dXNCYXIgPSAkKFwiI3N0YXR1cyBwXCIpO1xyXG5cclxuICAgIHN0YXR1c0JhclxyXG4gICAgICAgIC5odG1sKCcnKVxyXG4gICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICBcImZvbnRXZWlnaHRcIjogXCJub3JtYWxcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcImJsYWNrXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFuaVNldHRpbmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0Jhci5odG1sKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZXBsYWNlWEVxdShhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLypcclxuICAgIFJlcGxhY2UgdGhlIHggaW4gdGhlIGRpc2FwcGVhcmVkIGVxdWF0aW9uIHdpdGhvdXQgaGF2aW5nIHRoZSB5IGRpc2FwcGVhci5cclxuICAgICovXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICBpZiAoYW5pU2V0dGluZ3MuZ3JhcGhPcHQuaGlkZUVxdWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgICAgIC5jc3MoXCJhbmltYXRpb25cIiwgYHRleHREaXNhcHBlYXIgJHthbmlEdXJhdGlvbiowLjV9cyBlYXNlLWluLW91dGApXHJcbiAgICAgICAgICAgICAgICAub25lKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlcXVQYXJhKS5jc3MoXCJvcGFjaXR5XCIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dFdmFsdWF0ZUVxdShhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLypcclxuICAgIEdldCB0aGUgeSBhbnN3ZXIgYW5kIHRoZSB4LWNoYW5nZWQgZXF1YXRpb25cclxuICAgICovXHJcbiAgICB2YXIgcG9pbnREYXRhID0gYW5pU2V0dGluZ3MuZGF0YXBvaW50c1thbmlTZXR0aW5ncy5jdXJyZW50Um91bmRdLFxyXG4gICAgICAgIGNoYW5nZUVxdSA9IHBvaW50RGF0YS5jaGFuZ2VFcXU7XHJcblxyXG4gICAgLypcclxuICAgIFNob3cgdGhlIG5ldyBlcXVhdGlvbiB3aXRoIHRoZSByZXBsYWNlZCB4LXZhbHVlIGVxdWF0aW9uXHJcbiAgICAqL1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgaWYgKGFuaVNldHRpbmdzLmdyYXBoT3B0LmhpZGVFcXVhdGlvbikge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBrYXRleC5yZW5kZXIoYCR7Y2hhbmdlRXF1fWAsIGVxdVBhcmEpO1xyXG4gICAgICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuY3NzKFwiYW5pbWF0aW9uXCIsIGB0ZXh0QXBwZWFyICR7YW5pRHVyYXRpb24qMC41fXMgZWFzZS1pbi1vdXRgKVxyXG4gICAgICAgICAgICAgICAgLm9uZShcImFuaW1hdGlvbmVuZFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dZQW5zKGFuaVNldHRpbmdzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvKlxyXG4gICAgR2V0IHRoZSBjdXJyZW50IHJvdW5kIGFuZCBjdXJyZW50IGRhdGEgcG9pbnRzXHJcbiAgICAqL1xyXG4gICAgdmFyIHBvaW50RGF0YSA9IGFuaVNldHRpbmdzLmRhdGFwb2ludHNbYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kXTtcclxuXHJcbiAgICAvKlxyXG4gICAgQW5pbWF0ZSB0aGUgbmV3IHkgdmFsdWUgdG8gdGhlIGNvb3JkaW5hdGVkIHkgY29sdW1uIGFuZCBvbmNlXHJcbiAgICBhbmltYXRpb24gaXMgZG9uZSB0aGVuIHJldHVybiB0aGUgcHJvbWlzZVxyXG4gICAgKi9cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgIGlmIChhbmlTZXR0aW5ncy5ncmFwaE9wdC5oaWRlRXF1YXRpb24pIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJChlcXVQYXJhKVxyXG4gICAgICAgICAgICAgICAgLmNzcyhcImFuaW1hdGlvblwiLCBgdGV4dERpc2FwcGVhciAke2FuaUR1cmF0aW9uKjAuNX1zIGVhc2UtaW4tb3V0YClcclxuICAgICAgICAgICAgICAgIC5vbmUoXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBrYXRleC5yZW5kZXIoYCR7cG9pbnREYXRhLnl9YCwgZXF1UGFyYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuU2hvdyB0aGUgY2hvc2VuIGVxdWF0aW9uIHRvIGdyYXBoXHJcbiovXHJcbmZ1bmN0aW9uIHNob3dFcXVhdGlvbkFnYWluKGFuaVNldHRpbmdzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICBpZiAoYW5pU2V0dGluZ3MuZ3JhcGhPcHQuaGlkZUVxdWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgICAgIC5jc3MoXCJhbmltYXRpb25cIiwgYHRleHRBcHBlYXIgJHthbmlEdXJhdGlvbiowLjV9cyBlYXNlLWluLW91dGApXHJcbiAgICAgICAgICAgICAgICAub25lKFwiYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChlcXVQYXJhKS5jc3MoXCJvcGFjaXR5XCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbk9uY2UgdGhlIHktdmFsdWUgYXBwZWFycyBpbiB0aGUgY29ycmVjdCB5LWNvbHVtbiB0aGVuIGZ1bGZpbGwgdGhlIHByb21pc2UuXHJcbiovXHJcbmZ1bmN0aW9uIHBsYWNlWVZhbHVlKGFuaVNldHRpbmdzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBwb2ludERhdGEgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF07XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICB2YXIgaW5wdXQgPSAkKGB0ZCN5dmFsJHtwb2ludERhdGEuaWQgKyAxfWApWzBdO1xyXG4gICAgICAgICQoaW5wdXQpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgJChpbnB1dCkuYXBwZW5kKGA8cD4ke3BvaW50RGF0YS55fTwvcD5gKTtcclxuICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5PbmNlIHRoZSBlcXVhdGlvbiBpcyBjbGVhcmVkIGFuZCByZXNldCB0byB0aGUgZGVmYXVsdCBlcXVhdGlvblxyXG50aGVuIGZ1bGZpbGwgdGhlIHByb21pc2VcclxuKi9cclxuZnVuY3Rpb24gcmVzZXRSb3VuZChhbmlTZXR0aW5ncykge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gICAgdmFyIHBvaW50RGF0YSA9IGFuaVNldHRpbmdzLmRhdGFwb2ludHNbYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kXTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICBpZiAoYW5pU2V0dGluZ3MuZ3JhcGhPcHQuaGlkZUVxdWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgICAgIC5jc3MoXCJhbmltYXRpb25cIiwgYHRleHREaXNhcHBlYXIgJHthbmlEdXJhdGlvbiowLjE1fXMgZWFzZS1pbi1vdXRgKVxyXG4gICAgICAgICAgICAgICAgLm9uZShcImFuaW1hdGlvbmVuZFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoZXF1UGFyYSkuY3NzKFwib3BhY2l0eVwiLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBrYXRleC5yZW5kZXIoYCR7cHJvZk9wdC5sYXRleH1gLCBlcXVQYXJhKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5SZXR1cm4gdG8gZGVmYXVsdCBiZWdpbm5pbmcgZXF1YXRpb24gZm9yIHRoZSBuZXh0IGFuaW1hdGlvbiBvciBmb3IgdGhlIGVuZFxyXG4qL1xyXG5mdW5jdGlvbiBzaG93RGVmYXVsdEVxdShhbmlTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgaWYgKGFuaVNldHRpbmdzLmdyYXBoT3B0LmhpZGVFcXVhdGlvbikge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKGVxdVBhcmEpXHJcbiAgICAgICAgICAgICAgICAuY3NzKFwiYW5pbWF0aW9uXCIsIGB0ZXh0QXBwZWFyICR7YW5pRHVyYXRpb24qMC4xNX1zIGVhc2UtaW4tb3V0YClcclxuICAgICAgICAgICAgICAgIC5vbmUoXCJhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGVxdVBhcmEpLmNzcyhcIm9wYWNpdHlcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuQWNjZXB0IHRoZSBkYXRhcG9pbnQgYW5kIGl0cyBpdGVyYXRvciBhbmQgcGxvdCB0aGF0IHBvaW50IGJlaW5nIHBhc3NlZCB0aHJvdWdoXHJcbiovXHJcbmZ1bmN0aW9uIHBsb3R0ZXIoYW5pU2V0dGluZ3MpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgcGxvdEdyYXBoLnVwZGF0ZShhbmlTZXR0aW5ncywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5UaGlzIGZ1bmN0aW9uIGFjdHMgYXMgYW4gaXRlcmF0b3Igc28gdGhhdCB0aGUgcHJvbWlzZSBjaGFpbiBrbm93cyB3aGljaFxyXG5kYXRhcG9pbnQgdG8gaGFuZGxlIGFuZCB0byBhbmltYXRlXHJcbiovXHJcbmZ1bmN0aW9uIHVwZGF0ZVJvdW5kKGFuaVNldHRpbmdzKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgcGxhY2Vob2xkZXIgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF07XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgYW5pU2V0dGluZ3MuY3VycmVudFJvdW5kICs9IDE7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIudXBkYXRlUG9pbnQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qXHJcblR3byBmdW5jdGlvbnMgaW4gb3JkZXIgdG8gcmVwbGFjZSB0aGUgZnVuY3Rpb24gbWFjaGluZSBnaWYgd2l0aCB0aGUgYW5pbWF0ZWRcclxuZ2lmIGFuZCBiYWNrd2FyZHMuXHJcbiovXHJcbmZ1bmN0aW9uIGFuaW1hdGVGdW5jTWFjaGluZShhbmlTZXR0aW5ncykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgJChcIiNmdW5jdGlvbk1hY2hpbmVcIikuY3NzKHtcclxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWltYWdlXCI6IFwidXJsKC4vaW1nL2Z1bmN0aW9uTWFjaGluZUFuaS5naWYpXCJcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJlc29sdmUoYW5pU2V0dGluZ3MpXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc3RvcEFuaUZ1bmNNYWNoaW5lKGFuaVNldHRpbmdzKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgICAgICAkKFwiI2Z1bmN0aW9uTWFjaGluZVwiKS5jc3Moe1xyXG4gICAgICAgICAgICBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoLi9pbWcvZnVuY3Rpb25NYWNoaW5lU3RpbGwuZ2lmKVwiXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXNvbHZlKGFuaVNldHRpbmdzKVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbkEgZnVuY3Rpb24gdG8gc2hvdyB0aGUgeSBhbnN3ZXIgbGVhdmluZyB0aGUgZnVuY3Rpb24gbWFjaGluZSB0b1xyXG5zdGFydCB0aGUgbmV4dCBhbmltYXRpb24gb2YgZ29pbmcgYmFjayB0byB0aGUgeSBjb2x1bW4uXHJcbiovXHJcbmZ1bmN0aW9uIG1pbmlBbmkoYW5pU2V0dGluZ3MpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG5cclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBhbmlTZXR0aW5ncy5kYXRhcG9pbnRzW2FuaVNldHRpbmdzLmN1cnJlbnRSb3VuZF0sXHJcbiAgICAgICAgICAgIHl2YWx1ZSA9IHBsYWNlaG9sZGVyLnksXHJcbiAgICAgICAgICAgIHBhcmEgPSAkKGA8cD4ke3l2YWx1ZX08L3A+YCk7XHJcblxyXG4gICAgICAgICQocGFyYSkuY3NzKHtcclxuICAgICAgICAgICAgXCJmb250U2l6ZVwiOiBcIjIwcHhcIlxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChwYXJhKTtcclxuXHJcbiAgICAgICAgcGFyYVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogNjMwLFxyXG4gICAgICAgICAgICAgICAgdG9wOiAxNjBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcclxuICAgICAgICAgICAgICAgIHRvcDogMjAwXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJub25lXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShhbmlTZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbkEgcHJvbWlzZSBjaGFpbiB0byBydW4gdGhyb3VnaCB0aGUgd2hvbGUgYW5pbWF0aW9uIHByb2Nlc3NcclxuXHJcbk5PVEVcclxuQSBwcm9taXNlIGNoYWluIGhhcyBiZWVuIHV0aXppbGVkIGluIG9yZGVyIHRvIGVhc2lseSBwbHVnaW5cclxuZXh0cmEgZnVuY3Rpb25zIHRoYXQgd291bGQgYmUgZ3JlYXQgdG8gaGF2ZSBpbiB0aGUgYW5pbWF0aW9uXHJcbnByb2Nlc3MuICBBIHByb21pc2UgY2hhaW4gaGFzIGFsc28gYmVlbiB1c2VkIGluIG9yZGVyIHRvIHdhaXRcclxuZm9yIGEgYW5pbWF0aW9uIHRvIGVuZCB0byBzdGFydCB0aGUgbmV4dCBhbmltYXRpb24uXHJcbiovXHJcblxyXG4vKlxyXG5EZWZhdWx0IFByb21pc2UgQ2hhaW5cclxuKi9cclxuZnVuY3Rpb24gYW5pUHJvbWlzZUNoYWluKGRwcywgY2hhaW4pIHtcclxuXHJcbiAgICBkcHMuZGF0YXBvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhcG9pbnQpIHtcclxuICAgICAgICBpZiAoZGF0YXBvaW50LnVwZGF0ZVBvaW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNoYWluID0gY2hhaW5cclxuICAgICAgICAgICAgICAgIC50aGVuKHJ1bkFuaW1hdGlvbihcInhUb01hY2hpbmVcIiwgZGF0YXBvaW50LngpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oYW5pbWF0ZUZ1bmNNYWNoaW5lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShcIkNhbGN1bGF0aW5nXCIpKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVwbGFjZVhFcXUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzaG93RXZhbHVhdGVFcXUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzaG93WUFucylcclxuICAgICAgICAgICAgICAgIC50aGVuKHNob3dFcXVhdGlvbkFnYWluKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RvcEFuaUZ1bmNNYWNoaW5lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShcIlwiKSlcclxuICAgICAgICAgICAgICAgIC50aGVuKG1pbmlBbmkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihydW5BbmltYXRpb24oXCJtYWNoaW5lVG9ZXCIsIGRhdGFwb2ludC55KSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHBsYWNlWVZhbHVlKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocnVuQW5pbWF0aW9uKFwieVRvU3RhdHVzQmFyXCIsIGAoJHtkYXRhcG9pbnQueH0sJHtkYXRhcG9pbnQueX0pYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzdGF0dXNNZXNzYWdlKGBQbG90dGluZyAoJHtkYXRhcG9pbnQueH0sJHtkYXRhcG9pbnQueX0pYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihwbG90dGVyKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc3RhdHVzTWVzc2FnZShgYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNldFJvdW5kKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oc2hvd0RlZmF1bHRFcXUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGFpbiA9IGNoYWluLnRoZW4odXBkYXRlUm91bmQpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcbklmIHRoZSBcIkhpZGUgQW5pbWF0aW9uXCIgY2hlY2tib3ggaXMgY2hlY2tlZCB0aGVuIHNraXAgdGhlIHdob2xlIGFuaW1hdGlvblxyXG5wcm9taXNlIGNoYWluIGFuZCBqdXN0IGFwcGVuZCB0aGUgeSB2YWx1ZXNcclxuKi9cclxuZnVuY3Rpb24gYW5pbWF0ZUhpZGUoZHBzLCBjaGFpbikge1xyXG5cclxuICAgIGRwcy5kYXRhcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKGRhdGFwb2ludCkge1xyXG4gICAgICAgIGlmIChkYXRhcG9pbnQudXBkYXRlUG9pbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgY2hhaW4gPSBjaGFpblxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocGxhY2VZVmFsdWUpXHJcbiAgICAgICAgICAgICAgICAudGhlbihzdGF0dXNNZXNzYWdlKGBQbG90dGluZyAoJHtkYXRhcG9pbnQueH0sJHtkYXRhcG9pbnQueX0pYCkpXHJcbiAgICAgICAgICAgICAgICAudGhlbihwbG90dGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhaW4gPSBjaGFpbi50aGVuKHVwZGF0ZVJvdW5kKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKlxyXG5IYW5kbGUgYWxsIENTUyBhbmltYXRpb25zIGJ5IGNyZWF0aW5nIGEgUHJvbWlzZSBjaGFpbiB0aHJvdWdoIGEgZm9yIGxvb3AuXHJcbiovXHJcbmZ1bmN0aW9uIGFuaW1hdG9yQ29udHJvbChkcHMpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBudW1Db250YWluZXIgPSAkKFwiI251bUNvbnRhaW5lclwiKSxcclxuICAgICAgICBjaGFpbiA9IFByb21pc2UucmVzb2x2ZShkcHMpO1xyXG5cclxuICAgIG51bUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG5cclxuICAgIGlmIChhbmlEdXJhdGlvbiA9PT0gMC41KSB7XHJcbiAgICAgICAgYW5pbWF0ZUhpZGUoZHBzLCBjaGFpbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFuaVByb21pc2VDaGFpbihkcHMsIGNoYWluKTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiLypcclxuU2V0IHVwIHRoZSBiYXNpYyB2YXJpYWJsZXMuXHJcbiovXHJcbnZhciB4TWVtb3J5ID0gW10sXHJcbiAgICBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIiksXHJcbiAgICBpbnB1dENvdW50ID0gaW5wdXRzLmxlbmd0aCxcclxuICAgIHJ1bk1hc3RlciA9IHRydWUsXHJcbiAgICBydW4gPSB0cnVlO1xyXG5cclxuLypcclxuQXR0YWNoIGFuIG9uaW5wdXQgZXZlbnQgdG8gYWxsIHRoZSBpbnB1dCBib3hlcyBpbiBvcmRlciB0byB2YWxpZGF0ZSB0aGVtIHdpdGhpbiB0aGUgYm91bmRzXHJcbnRoYXQgdGhlIHByb2Zlc3NvciBoYXMgY2hvc2VuLiAgSWYgdGhlIGJvdW5kcyBhcmUgZXhjZWVkZWQsIHRoZW4gZGlzYWJsZSB0aGUgXCJHbyFcIiBidXR0b25cclxuYW5kIG91dHB1dCBhIG1lc3NhZ2UgdG8gdGhlIHN0YXR1cyBiYXIuXHJcbiovXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgaW5wdXRzW2ldLm9ua2V5dXAgPSBlID0+IHtcclxuXHJcbiAgICAgICAgdmFyIHhJbnB1dFZhbCA9IGUuc3JjRWxlbWVudC52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGUud2hpY2ggPT09IDY5KSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgJChcIiNzdGF0dXMgcFwiKS5odG1sKGBDYW4ndCBkbyB0aGF0IGJybyFgKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG4vKlxyXG5GdW5jdGlvbiB0byBzZWxlY3QgdGhlIGNob3NlbiBlcXVhdGlvbiB3aXRoIGl0cyBuYW1lIGFuZCBncmFwaCB3aW5kb3cgYm91bmRhcmllcy5cclxuKi9cclxuZnVuY3Rpb24gY2hlY2tDb25maWcodmFsKSB7XHJcbiAgICB2YXIgcHJvZk9wdDtcclxuICAgICQuZWFjaChwcm9mZXNzb3JDb25maWdGaWxlLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpdGVtLmVxdWF0aW9uID09PSB2YWwpIHtcclxuICAgICAgICAgICAgcHJvZk9wdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBwcm9mT3B0O1xyXG59XHJcblxyXG4vKlxyXG5VcG9uIGNob29zaW5nIGFub3RoZXIgZXF1YXRpb24gdG8gZ3JhcGgsIGNsZWFyIGFsbCB0aGUgdmFsdWVzXHJcbiovXHJcbmZ1bmN0aW9uIGNsZWFyVmFsdWVzKCkge1xyXG4gICAgdmFyIHhpbnB1dHMgPSAkKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIiksXHJcbiAgICAgICAgeWlucHV0cyA9ICQoYHRyIHRkOm50aC1vZi10eXBlKDIpYCk7XHJcblxyXG4gICAgeGlucHV0cy5lYWNoKGZ1bmN0aW9uIChpLCBpdGVtKSB7XHJcbiAgICAgICAgaXRlbS52YWx1ZSA9IFwiXCI7XHJcbiAgICB9KTtcclxuXHJcbiAgICB5aW5wdXRzLmVhY2goZnVuY3Rpb24gKGksIGl0ZW0pIHtcclxuICAgICAgICBpdGVtLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuRGlwc2xheSBLYXRleCBlcXVhdGlvbi4gQUxTTyB1c2VkIGluIGFqYXguanNcclxuKi9cclxuZnVuY3Rpb24gY2hhbmdlUGxvdCh2YWwpIHtcclxuXHJcbiAgICB4TWVtb3J5ID0gW107XHJcblxyXG4gICAgY2xlYXJWYWx1ZXMoKTtcclxuXHJcbiAgICB3aW5kb3cucHJvZk9wdCA9IGNoZWNrQ29uZmlnKHZhbCk7XHJcblxyXG4gICAgdmFyIGVxdWF0ID0gdmFsLFxyXG4gICAgICAgIGVxdVBhcmEgPSAkKFwiI2Z1bmN0aW9uTWFjaGluZSAjZXF1XCIpWzBdO1xyXG5cclxuICAgICQoZXF1UGFyYSkuZW1wdHkoKTtcclxuXHJcbiAgICBpZiAod2luZG93LnByb2ZPcHQuaGlkZUVxdWF0aW9uID09PSBmYWxzZSkge1xyXG4gICAgICAgIGthdGV4LnJlbmRlcih3aW5kb3cucHJvZk9wdC5sYXRleCwgZXF1UGFyYSk7XHJcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5wcm9mT3B0LmhpZGVFcXVhdGlvbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICQoZXF1UGFyYSlcclxuICAgICAgICAgICAgLmFwcGVuZChcIjxoMj5NeXN0ZXJ5IEVxdWF0aW9uPC9oMj5cIilcclxuICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcInBhZGRpbmdUb3BcIjogXCI1cHhcIixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbkFuaW1hdGlvbiBwYXRoIGZvciB0aGUgc3RhaXJzdGVwXHJcbiovXHJcbmZ1bmN0aW9uIHN0YWlyU3RlcChvcHRpb25zKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHZhciBoaWdod2F5UGF0aCA9IDI4MCxcclxuICAgICAgICBsYXN0U2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGggLSAxXTtcclxuICAgIGxhc3RTaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7b3B0aW9ucy5uYW1lfSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwJSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7b3B0aW9ucy5zdGFydFRvcE9mZn1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke29wdGlvbnMuc3RhcnRMZWZ0T2ZmfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMTAlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMzMlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7b3B0aW9ucy5zdGFydFRvcE9mZn1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke2hpZ2h3YXlQYXRofXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNjYlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7b3B0aW9ucy5lbmRUb3BPZmZ9cHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtoaWdod2F5UGF0aH1weDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDkwJSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEwMCUge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke29wdGlvbnMuZW5kVG9wT2ZmfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7b3B0aW9ucy5lbmRMZWZ0T2ZmfXB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9YCwgbGFzdFNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XHJcbn1cclxuXHJcbi8qXHJcbkEgc2V0IG9mIGZ1bmN0aW9ucyB1c2luZyB0aGUgc3RhaXJzdGVwIGFuaW1hdGlvbiB0ZW1wbGF0ZVxyXG50byBjcmVhdGUgcGF0aHdheXMgd2l0aCBjb29yZGluYXRlIGRhdGFcclxuKi9cclxuZnVuY3Rpb24gbWFrZVhUb01hY2hpbmUoaW5wdXRDb3JkcywgaW5kZXgpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgc3RhaXJTdGVwKHtcclxuICAgICAgICBzdGFydFRvcE9mZjogaW5wdXRDb3Jkcy50b3AgKyAxMCxcclxuICAgICAgICBzdGFydExlZnRPZmY6IGlucHV0Q29yZHMubGVmdCArIDMwLFxyXG4gICAgICAgIGVuZFRvcE9mZjogMTUwLFxyXG4gICAgICAgIGVuZExlZnRPZmY6IDQ1MCxcclxuICAgICAgICBuYW1lOiBgeFRvTWFjaGluZSR7aW5kZXh9YFxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VNYWNoaW5lVG9ZKGlucHV0Q29yZHMsIGluZGV4KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHN0YWlyU3RlcCh7XHJcbiAgICAgICAgc3RhcnRUb3BPZmY6IDIwMCxcclxuICAgICAgICBzdGFydExlZnRPZmY6IDYzMCxcclxuICAgICAgICBlbmRUb3BPZmY6IGlucHV0Q29yZHMudG9wICsgMTAsXHJcbiAgICAgICAgZW5kTGVmdE9mZjogaW5wdXRDb3Jkcy5yaWdodCArIDUsXHJcbiAgICAgICAgbmFtZTogYG1hY2hpbmVUb1kke2luZGV4fWBcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlWVRvU3RhdHVzQmFyKGlucHV0Q29yZHMsIGluZGV4KSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIHN0YWlyU3RlcCh7XHJcbiAgICAgICAgc3RhcnRUb3BPZmY6IGlucHV0Q29yZHMudG9wICsgNSxcclxuICAgICAgICBzdGFydExlZnRPZmY6IGlucHV0Q29yZHMucmlnaHQgKyAxMCxcclxuICAgICAgICBlbmRUb3BPZmY6IDUwLFxyXG4gICAgICAgIGVuZExlZnRPZmY6IDQwMCxcclxuICAgICAgICBuYW1lOiBgeVRvU3RhdHVzQmFyJHtpbmRleH1gXHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuU2V0IHVwIHRoZSB4TWVtb3J5IGFycmF5IGFuZCB0aGUgYW5pbWF0aW9uIHBhdGhzIGZvciBlYWNoIGlucHV0IGJveC5cclxuXHJcbk5PVEU6IFNldHRpbmcgdXAgdGhlIHhNZW1vcnkgYXJyYXkgYWxzbyBtYWtlcyBpdCBzbyB0aGF0IG5vIGFuaW1hdGlvbnNcclxuICAgICAgYXJlIHJlcGVhdGVkIGJ5IG11bHRpcGxlIGNsaWNrcyBvbiB0aGUgXCJHbyFcIiBidXR0b24uXHJcbiovXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRDb3VudDsgaSsrKSB7XHJcbiAgICB4TWVtb3J5W2ldID0gbnVsbDtcclxuXHJcbiAgICB2YXIgaW5wdXRDb29yID0gaW5wdXRzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIG1ha2VYVG9NYWNoaW5lKGlucHV0Q29vciwgaSk7XHJcbiAgICBtYWtlTWFjaGluZVRvWShpbnB1dENvb3IsIGkpO1xyXG4gICAgbWFrZVlUb1N0YXR1c0JhcihpbnB1dENvb3IsIGkpO1xyXG4gICAgJChcIiNudW1Db250YWluZXJcIikuYXBwZW5kKCQoYDxwPjwvcD5gKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFVzZXJFeGNlcHRpb24obWVzc2FnZSwgZXJyb3JOdW0pIHtcclxuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB0aGlzLmVycm9yTnVtID0gZXJyb3JOdW07XHJcbiAgICB0aGlzLm5hbWUgPSBcIlVzZXJFeGNlcHRpb25cIjtcclxufVxyXG5cclxuLypcclxuU2V0IHVwIHRoZSBvYmplY3QgdGhhdCB3aWxsIGJlIHBhc3NlZCB0aHJvdWdoIHRoZSBwcm9taXNlIGNoYWluXHJcbmluIGFuaW1hdG9yIGNvbnRyb2wuXHJcbiovXHJcbmZ1bmN0aW9uIHNldFVwT2JqZWN0KHhpbnB1dHMsIGdyYXBoT3B0LCBhbmlTZXR0aW5ncykge1xyXG4gICAgeGlucHV0cy5lYWNoKGZ1bmN0aW9uIChpKSB7XHJcblxyXG4gICAgICAgIHZhciB4dmFsdWUgPSAkKHRoaXMpLnZhbCgpLFxyXG4gICAgICAgICAgICB4dmFsLFxyXG4gICAgICAgICAgICByb3VuZGl0O1xyXG5cclxuICAgICAgICBpZiAoeHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHh2YWwgPSAreHZhbHVlO1xyXG4gICAgICAgICAgICByb3VuZGl0ID0geHZhbC50b0ZpeGVkKHByb2ZPcHQucm91bmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgJCh0aGlzKS52YWwocm91bmRpdCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvZk9wdC52aWV3LngubWluIDw9IHJvdW5kaXQgJiYgcm91bmRpdCA8PSBwcm9mT3B0LnZpZXcueC5tYXgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcmVwbGFjZVggPSBncmFwaE9wdC5lcXVhdGlvbi5yZXBsYWNlKC94L2csIGAoJHtyb3VuZGl0fSlgKSxcclxuICAgICAgICAgICAgICAgICAgICB5dmFsID0gbWF0aC5ldmFsKHJlcGxhY2VYKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHl2YWwgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXRDb29yID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiByb3VuZGl0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogeXZhbC50b0ZpeGVkKHByb2ZPcHQucm91bmRpbmcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VFcXU6IHByb2ZPcHQubGF0ZXgucmVwbGFjZShcInhcIiwgYCgke3JvdW5kaXR9KWApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUG9pbnQ6IHhNZW1vcnlbaV0gIT09IHJvdW5kaXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAkKFwiI251bUNvbnRhaW5lciBwXCIpLmdldChpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVXNlckV4Y2VwdGlvbihcIm91dCBvZiBkb21haW5cIiwgeHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoSW5maW5pdHkgPT09IHl2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVXNlckV4Y2VwdGlvbihcInVuZGVmaW5lZCB2YWx1ZVwiLCB4dmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBDbGVhciBvdXQgdGhlIFlzIHdoZW4gdGhleSBkb24ndCBlcXVhbCBlYWNoIG90aGVyIGFuZCBuZWVkIHRvIGJlIHVwZGF0ZWRcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAocG9pbnQudXBkYXRlUG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGB0ZCN5dmFsJHtpICsgMX1gKS5odG1sKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qVXBkYXRlIHRoZSB4bWVtb3J5Ki9cclxuICAgICAgICAgICAgICAgIHhNZW1vcnlbaV0gPSByb3VuZGl0O1xyXG4gICAgICAgICAgICAgICAgYW5pU2V0dGluZ3MuZGF0YXBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBVc2VyRXhjZXB0aW9uKFwib3V0IG9mIHdpbmRvd1wiLCB4dmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qXHJcblNldCBhbGwgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHNldCB0byBhbmlTZXR0aW5ncyBpbiB0aGUgc2V0VXBPYmplY3QgZnVuY3Rpb25cclxuXHJcbk5PVEVcclxuZ3JhcGhPcHQuY2FsbGJhY2sgc3RpbGwgbmVlZHMgYSB2aWFibGUgbWV0aG9kIVxyXG4qL1xyXG5mdW5jdGlvbiBzdGFydEZ1bmNNYWNoKCkge1xyXG5cclxuICAgIHZhciB4aW5wdXRzID0gJChcImlucHV0W3R5cGU9J251bWJlciddXCIpLFxyXG4gICAgICAgIGdyYXBoT3B0ID0ge1xyXG4gICAgICAgICAgICBlcXVhdGlvbjogcHJvZk9wdC5lcXVhdGlvbixcclxuICAgICAgICAgICAgaGlkZUVxdWF0aW9uOiBwcm9mT3B0LmhpZGVFcXVhdGlvbixcclxuICAgICAgICAgICAgdmlldzogcHJvZk9wdC52aWV3LFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogYW5pRHVyYXRpb25cclxuICAgICAgICB9LFxyXG4gICAgICAgIGFuaVNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBkYXRhcG9pbnRzOiBbXSxcclxuICAgICAgICAgICAgY3VycmVudFJvdW5kOiAwLFxyXG4gICAgICAgICAgICBncmFwaE9wdDogZ3JhcGhPcHRcclxuICAgICAgICB9O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgc2V0VXBPYmplY3QoeGlucHV0cywgZ3JhcGhPcHQsIGFuaVNldHRpbmdzKTtcclxuICAgICAgICBhbmltYXRvckNvbnRyb2woYW5pU2V0dGluZ3MpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHhNZW1vcnkgPSBbXTtcclxuICAgICAgICAkKFwiI3N0YXR1cyBwXCIpXHJcbiAgICAgICAgICAgIC5odG1sKGAke2UuZXJyb3JOdW19IHgtdmFsdWUgJHtlLm1lc3NhZ2V9LmApXHJcbiAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJmb250V2VpZ2h0XCI6IFwiYm9sZFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNiNjI3MjdcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLypCZWZvcmUgcnVubmluZyB0aGUgZnVuY3Rpb24gbWFjaGluZSwgcHV0IGFsbCBpbnB1dHMgbmV4dCB0byBlYWNoIG90aGVyLiovXHJcbmZ1bmN0aW9uIGNsZWFuSW5wdXRzKCkge1xyXG4gICAgdmFyIHhpbnB1dHMgPSAkKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIiksXHJcbiAgICAgICAgaW5wdXRBcnJheSA9IFtdO1xyXG5cclxuICAgIHhpbnB1dHMuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIHZhciBpbnB1dFZhbHVlID0gJCh0aGlzKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKGlucHV0VmFsdWUgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgaW5wdXRBcnJheS5wdXNoKGlucHV0VmFsdWUpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnZhbChcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHhpbnB1dHMuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIGlmIChpIDwgaW5wdXRBcnJheS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS52YWwoaW5wdXRBcnJheVtpXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCh0aGlzKS52YWwoXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuJChcIiNjbG9zZUhlbHBcIikuY2xpY2soZSA9PiB7XHJcbiAgICAkKGUudGFyZ2V0LnBhcmVudEVsZW1lbnQpLmZhZGVPdXQoMTAwKTtcclxuICAgICQoXCIjc2hhZGVcIikuZmFkZU91dCgyMDApO1xyXG4gICAgbG9jYWxTdG9yYWdlWydmaXJzdFRpbWVGdW5jdGlvbk1hY2hpbmUnXSA9IGZhbHNlO1xyXG59KTtcclxuXHJcbiQoXCIjb3BlbkhlbHBcIikuY2xpY2soZSA9PiB7XHJcbiAgICAkKFwiI2luc3RydWN0aW9uc1wiKS5mYWRlSW4oMTAwKTtcclxuICAgICQoXCIjc2hhZGVcIikuZmFkZUluKDEwMDApO1xyXG59KTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGUgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgZmlyc3R0aW1lID0gbG9jYWxTdG9yYWdlWydmaXJzdFRpbWVGdW5jdGlvbk1hY2hpbmUnXTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGZpcnN0dGltZSA9PT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgICAgJChcIiNpbnN0cnVjdGlvbnNcIikuaGlkZSgpO1xyXG4gICAgICAgICQoXCIjc2hhZGVcIikuaGlkZSgpO1xyXG4gICAgfVxyXG59KVxyXG5cclxuLypcclxuT25jaGFuZ2UgZXZlbnQgaGFuZGxlciBmb3IgdGhlIHNlbGVjdCBodG1sIGVsZW1lbnQuXHJcbiovXHJcbiQoXCJzZWxlY3RcIikuY2hhbmdlKGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgc2VsZWN0ZWQgPSAkKGBvcHRpb25bdmFsdWU9XCIke2UudGFyZ2V0LnZhbHVlfVwiXWApLFxyXG4gICAgICAgIHByb2ZPcHQgPSBKU09OLnBhcnNlKHNlbGVjdGVkLmF0dHIoXCJkYXRhLXByb2ZvcHRcIikpO1xyXG5cclxuICAgIHBsb3RHcmFwaC5zZXR1cChwcm9mT3B0LCBcIiNncmFwaFwiKVxyXG4gICAgY2hhbmdlUGxvdChlLnRhcmdldC52YWx1ZSk7XHJcbn0pO1xyXG5cclxuLypcclxuRE9DVU1FTlQga2V5ZG93biBldmVudCBoYW5kbGVyXHJcbiovXHJcbiQoZG9jdW1lbnQpLmtleXByZXNzKGZ1bmN0aW9uIChlKSB7XHJcbiAgICBpZiAoZS53aGljaCA9PSAxMyAmJiBydW5NYXN0ZXIpIHtcclxuICAgICAgICBjbGVhbklucHV0cygpO1xyXG4gICAgICAgIHN0YXJ0RnVuY01hY2goKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vKlxyXG5HTyEgQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4qL1xyXG4kKFwiaW5wdXRbdHlwZT0nYnV0dG9uJ11bdmFsdWU9J0dvISddXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChydW5NYXN0ZXIpIHtcclxuICAgICAgICBjbGVhbklucHV0cygpO1xyXG4gICAgICAgIHN0YXJ0RnVuY01hY2goKTtcclxuICAgIH1cclxufSk7XHJcbiJdfQ==
