var statusBar = $("#status p"),
    lastSheet = document.styleSheets[document.styleSheets.length - 1],
    equPara = $("#functionMachine #equ")[0],
    aniDuration = 1;

//TODO: Get the function machine in there.
//TODO: Validate x values within the set domain of the profOpt
//TODO: Check browser compatibility (Promises in IE).

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
    return function (aniSettings) {
        return new Promise(function (resolve) {
            statusBar.html(`<p>${message}</p>`);
            resolve(aniSettings);
        });

    };
}

function replaceXEqu(data) {
    "use strict";

    /*
    Replace the x in the disappeared equation without having the y disappear.
    */
    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", `textDisappear ${aniDuration}s ease-in-out`)
            .one("animationend", function (e) {
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
            .css("animation", `textAppear ${aniDuration}s ease-in-out`)
            .one("animationend", function (e) {
                $(equPara).css("opacity", 1);
                resolve(aniSettings);
            })
    });
}

function showYAns(aniSettings) {
    "use strict";

    /*
    Animate the new y value to the coordinated y column and once
    animation is done then return the promise
    */
    var pointData = aniSettings.datapoints[aniSettings.currentRound];

    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", `textDisappear ${aniDuration}s ease-in-out`)
            .one("animationend", function () {
                $(equPara).css("opacity", 0);
                katex.render(`${pointData.y}`, equPara);
                resolve(aniSettings);
            });
    });
}

function showEquationAgain(aniSettings) {
    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", `textAppear ${aniDuration}s ease-in-out`)
            .one("animationend", function (e) {
                $(equPara).css("opacity", 1);
                resolve(aniSettings);
            });
    });
}

function placeYValue(aniSettings) {
    "use strict";
    var pointData = aniSettings.datapoints[aniSettings.currentRound];

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
            .css("animation", `textDisappear ${aniDuration}s ease-in-out`)
            .one("animationend", function (e) {
                $(equPara).css("opacity", 0);
                katex.render(`${profOpt.equation}`, equPara);
                resolve(aniSettings);
            });
    });
}

function showDefaultEqu(aniSettings) {
    /*
    Return to default beginning equation for the next animation or for the end
    */
    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", `textAppear ${aniDuration}s ease-in-out`)
            .one("animationend", function (e) {
                $(equPara).css("opacity", 1);
                resolve(aniSettings);
            });
    });
}

/*
Accept the datapoint and its iterator and plot that point being passed through
*/
function plotter(aniSettings) {
    "use strict";
    var pointData = aniSettings.datapoints[aniSettings.currentRound];

    return new Promise(function (resolve) {
        aniSettings.graphOpt.callback();
        resolve(aniSettings);
    });
}

function updateRound(aniSettings) {
    "use strict";

    var placeholder = aniSettings.datapoints[aniSettings.currentRound];

    /*
    This function acts as an iterator so that the promise chain knows which
    datapoint to handle and to animate
    */

    return new Promise(function (resolve) {
        aniSettings.currentRound += 1;
        placeholder.updatePoint = false;

        resolve(aniSettings);
    });
};

function aniPromiseChain(dps, chain) {
    dps.datapoints.forEach(function (datapoint) {
        if (datapoint.updatePoint === true) {
                chain = chain
                    .then(runAnimation("xToMachine", datapoint.x))
                    .then(statusMessage("Calculating"))
                    .then(replaceXEqu)
                    .then(showEvaluateEqu)
                    .then(showYAns)
                    .then(showEquationAgain)
                    .then(runAnimation("machineToY", datapoint.y))
                    .then(placeYValue)
                    .then(runAnimation("yToStatusBar", `(${datapoint.x},${datapoint.y})`))
                    .then(statusMessage(`Plotting (${datapoint.x},${datapoint.y})`))
                    .then(plotter)
                    .then(resetRound)
                    .then(statusMessage(``))
                    .then(showDefaultEqu);

        }
        chain = chain.then(updateRound);
    });
}

function noAniPromiseChain(dps, chain) {
    dps.datapoints.forEach(function (datapoint) {
        if (datapoint.updatePoint === true) {
            chain = chain
                .then(placeYValue)
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

    if (dps.graphOpt.animateHide) {
        noAniPromiseChain(dps, chain);
    } else {
        aniPromiseChain(dps, chain);
    }
}
