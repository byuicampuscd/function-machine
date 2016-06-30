var statusBar = $("#status p"),
    lastSheet = document.styleSheets[document.styleSheets.length - 1],
    equPara = $("#functionMachine #equ")[0];

function animationTemplate(aniSettings) {

    var pointData = aniSettings.datapoints[aniSettings.currentRound],
        startTopOff = pointData.beginCoor.top + 5,
        startLeftOff = pointData.beginCoor.left + 30,
        endTopOff = pointData.endCoor.top + 5,
        endLeftOff = pointData.endCoor.left + 30,
        highwayPath = 246.5,
        id = pointData.id.toString(),
        numContainer = $("#numContainer"),
        numPara = pointData.element;

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

    $(numContainer).append(numPara);

    return new Promise(function (resolve) {
        $(numPara)
            .css("position", "absolute")
            .css("top", `${startTopOff}px`)
            .css("left", `${startLeftOff}px`)
            .css("animation", `animationPath${id} 4s ease-in-out`)
            .css("opacity", `0`)
            .css("zIndex", `100`)
            .bind('animationend', function (e) {
                resolve(aniSettings);
            });
    })
}

function updateRound(aniSettings) {
    //make sure that the updatePoint is also showEvaluateEqud.
    return new Promise(function (resolve) {
        aniSettings.currentRound += 1;
        resolve(aniSettings);
    });
};

function replaceXEqu(data) {
    "use strict";

    return new Promise(function (resolve) {
        $(statusBar)
            .html("")
            .html("<p>>> Calculating</p>");

        $(equPara)
            .css("animation", "textDisappear 2s ease-in-out")
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 0);
                resolve(data);
            });
    });
}

function showEvaluateEqu(aniSettings) {

    var pointData = aniSettings.datapoints[aniSettings.currentRound],
        changeEqu = pointData.changeEqu;

    return new Promise(function (resolve) {

        if (typeof pointData.y === "number") {
            $(statusBar)
                .html("")
                .html("<p>>> Returning answer.</p>");
        }

        katex.render(`${changeEqu}`, equPara);

        $(equPara)
            .css("animation", 'textAppear 1s ease-in-out')
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 1);
                resolve(aniSettings);
            })
    });
}

function showYAns(aniSettings) {

    var pointData = aniSettings.datapoints[aniSettings.currentRound],
        newEndTop = pointData.beginCoor.top,
        newEndLeft = pointData.beginCoor.left + 100,
        newBeginTop = pointData.endCoor.top,
        newBeginLeft = pointData.endCoor.left;

    pointData.endCoor = {
        top: newEndTop,
        left: newEndLeft
    };

    pointData.beginCoor = {
        top: newBeginTop,
        left: newBeginLeft
    };

    pointData.element.innerText = pointData.y

    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", 'textDisappear 2s ease-in-out')
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 0);
                katex.render(`${pointData.y}`, equPara);
                $(equPara)
                    .css("animation", 'textAppear 1s ease-in-out')
                    .bind("animationend", function (e) {
                        $(equPara).css("opacity", 1);
                    });
                resolve(aniSettings);
            });
    });
}

function placeYValue(aniSettings) {

    var pointData = aniSettings.datapoints[aniSettings.currentRound];

    return new Promise(function (resolve) {
        var input = $(`td#yval${pointData.id + 1}`)[0];
        $(input).append(`<p>${pointData.y}</p>`);
        resolve(aniSettings);
    });
}

function resetRound(aniSettings) {

    var pointData = aniSettings.datapoints[aniSettings.currentRound];

    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", 'textDisappear 2s ease-in-out')
            .bind("animationend", function (e) {

                $(statusBar)
                    .html("")
                    .html("<p>>> Resetting...</p>");

                $(equPara).css("opacity", 0);
                katex.render(`${profOpt.equation}`, equPara);
                $(equPara)
                    .css("animation", 'textAppear 1s ease-in-out')
                    .bind("animationend", function (e) {
                        $(equPara).css("opacity", 1);
                        $(statusBar)
                            .html("");
                    });
                resolve(aniSettings);
            });
    });
}

//Handle all CSS animations
function animatorControl(dps) {
    "use strict";
    var numContainer = $("#numContainer"),
        chain = Promise.resolve(dps);

    numContainer.innerHTML = "";

    for (var i = 0; i < dps.datapoints.length; i++) {
        chain = chain.then(animationTemplate)
            .then(replaceXEqu)
            .then(showEvaluateEqu)
            .then(showYAns)
            .then(animationTemplate)
            .then(placeYValue)
            .then(resetRound)
            .then(updateRound);
    }
}
