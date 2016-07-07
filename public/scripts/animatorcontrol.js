var statusBar = $("#status p"),
    lastSheet = document.styleSheets[document.styleSheets.length - 1],
    equPara = $("#functionMachine #equ")[0],
    aniDuration = 2;


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
                $(equPara)
                    .css("animation", `textAppear ${aniDuration}s ease-in-out`)
                    .one("animationend", function (e) {
                        $(equPara).css("opacity", 1);
                        $(statusBar)
                            .html("");
                        resolve(aniSettings);
                    });
            });
    });
}

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
        var datapoint = dps.datapoints[i];
        if (datapoint.updatePoint === true) {
            chain = chain
                .then(runAnimation("xToMachine", datapoint.x))
                .then(replaceXEqu)
                .then(showEvaluateEqu)
                .then(showYAns)
                .then(showEquationAgain)
                .then(runAnimation("machineToY", datapoint.y))
                .then(placeYValue)
                .then(runAnimation("yToStatusBar", `(${datapoint.x},${datapoint.y})`))
                .then(resetRound)
                //                                .then(plotter);
        }
        chain = chain.then(updateRound);
    }
}
