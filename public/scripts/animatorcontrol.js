var statusBar = $("#status p"),
    lastSheet = document.styleSheets[document.styleSheets.length - 1],
    equPara = $("#functionMachine #equ")[0],
    aniDur = 1,
    aniDuration = 3;

function animationTemplate(aniSettings) {
    "use strict";

    /*
    Get all the coordinate data, elements and containers in order to make the animation work
    */
    var pointData = aniSettings.datapoints[aniSettings.currentRound],
        startTopOff = pointData.beginCoor.top + 5,
        startLeftOff = pointData.beginCoor.left + 30,
        endTopOff = pointData.endCoor.top + 5,
        endLeftOff = pointData.endCoor.left + 30,
        highwayPath = 246.5,
        id = pointData.id.toString(),
        numContainer = $("#numContainer"),
        numPara = pointData.element;

    /*
    Dynamically insert a unique animation keyframe for each input
    */
    lastSheet.insertRule(`@keyframes animationPath${id} {
                            0% {
                                opacity: 0;
                                top: ${startTopOff}px;
                                left: ${startLeftOff}px;
                            }
                            10% {
                                opacity: 1;
                            }
                            33% {
                                top: ${startTopOff}px;
                                left: ${highwayPath}px;
                            }
                            66% {
                                top: ${endTopOff}px;
                                left: ${highwayPath}px;
                            }
                            90% {
                                opacity: 1;
                            }
                            100% {
                                opacity: 0;
                                top: ${endTopOff}px;
                                left: ${endLeftOff}px;
                            }
                        }`, lastSheet.cssRules.length);

    /*
    Attach the number
    */
    $(numContainer).append(numPara);

    /*
    Make the promise that when the dynamic animation is done then this promise is finished
    */
    return new Promise(function (resolve) {
        $(numPara)
            .css({
                "position": "absolute",
                "top": `${startTopOff}px`,
                "left": `${startLeftOff}px`,
                "animation": `animationPath${id} ${aniDuration}s ease-in-out`,
                "opacity": `0`,
                "zIndex": `100`
            })
            .bind('animationend', function (e) {
                resolve(aniSettings);
            });
    })
}

function updateRound(aniSettings) {
    "use strict";

    var placeholder = aniSettings.datapoints[aniSettings.currentRound];

    return new Promise(function (resolve) {
        aniSettings.currentRound += 1;
        placeholder.updatePoint = false;

        resolve(aniSettings);
    });
};

function replaceXEqu(data) {
    "use strict";

    /*
    Replace the x in the disappeared equation without having the y disappear.
    */
    return new Promise(function (resolve) {
        $(statusBar)
            .html("<p>Calculating</p>");

        $(equPara)
            .css("animation", `textDisappear ${aniDur}s ease-in-out`)
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 0);
                resolve(data);
            });
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
        katex.render(`${changeEqu}`, equPara);

        $(equPara)
            .css("animation", `textAppear ${aniDur}s ease-in-out`)
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 1);
                resolve(aniSettings);
            })
    });
}

function showYAns(aniSettings) {
    "use strict";

    /*
    Get the original x-input box coordinates
    */
    var pointData = aniSettings.datapoints[aniSettings.currentRound],
        newEndTop = pointData.beginCoor.top,
        newEndLeft = pointData.beginCoor.left + 100,
        newBeginTop = pointData.endCoor.top,
        newBeginLeft = pointData.endCoor.left;

    /*
    Change the coordinates in the aniSettings so that the animation path
    starts in the machine and ends in coordinated y column
    */
    pointData.endCoor = {
        top: newEndTop,
        left: newEndLeft
    };

    pointData.beginCoor = {
        top: newBeginTop,
        left: newBeginLeft
    };

    /*
    The new paragraph tag to be animated is the y value
    */
    pointData.element.innerText = pointData.y

    /*
    Animate the new y value to the coordinated y column and once
    animation is done then return the promise
    */
    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", `textDisappear ${aniDur}s ease-in-out`)
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 0);
                katex.render(`${pointData.y}`, equPara);
                $(equPara)
                    .css("animation", 'textAppear 1s ease-in-out')
                    .bind("animationend", function (e) {
                        $(equPara).css("opacity", 1);
                        resolve(aniSettings);
                    });
            });
    });
}

function placeYValue(aniSettings) {
    "use strict";

    /*
    Get the current round, the y-column coordinates, and the status bar coordinates
    */
    var pointData = aniSettings.datapoints[aniSettings.currentRound],
        newBeginTop = pointData.endCoor.top,
        newBeginLeft = pointData.endCoor.left;

    pointData.beginCoor = {
        top: newBeginTop,
        left: newBeginLeft
    }

    pointData.endCoor = {
        top: 150,
        left: 300
    }

    /*
    Once the y-value appears in the correct y-column then fulfill the promise.
    */
    return new Promise(function (resolve) {
        var input = $(`td#yval${pointData.id + 1}`)[0];
        $(input).html("");
        $(input).append(`<p>${pointData.y}</p>`);
        resolve(aniSettings);
    });
}

function resetRound(aniSettings) {
    "use strict";

    /*
    Get the current round and current data points
    */
    var pointData = aniSettings.datapoints[aniSettings.currentRound];

    /*
    Once the equation is cleared and reset to the default equation
    then fulfill the promise
    */
    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", `textDisappear ${aniDur}s ease-in-out`)
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 0);
                katex.render(`${profOpt.equation}`, equPara);
                $(equPara)
                    .css("animation", `textAppear ${aniDur}s ease-in-out`)
                    .bind("animationend", function (e) {
                        $(equPara).css("opacity", 1);
                        $(statusBar)
                            .html("");
                        resolve(aniSettings);
                    });
            });
    });
}

function plotter(aniSettings) {
    "use strict";
    aniSettings.graphOpt.callback();
}

//Handle all CSS animations
function animatorControl(dps) {
    "use strict";
    var numContainer = $("#numContainer"),
        chain = Promise.resolve(dps);

    numContainer.innerHTML = "";

    for (var i = 0; i < dps.datapoints.length; i++) {

        //TODO: Send the x-value and the y-value together.
        //TODO: Check to see what I can take out in order to make functions.

        if (dps.datapoints[i].updatePoint === true) {
            chain = chain.then(animationTemplate)
                .then(replaceXEqu)
                .then(showEvaluateEqu)
                .then(showYAns)
                .then(animationTemplate)
                .then(placeYValue)
                .then(animationTemplate)
                .then(resetRound)
                //                .then(plotter);
        }
        chain = chain.then(updateRound);
    }
}
