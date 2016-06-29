var statusBar = $("#status p"),
    lastSheet = document.styleSheets[document.styleSheets.length - 1],
    equPara = $("#functionMachine #equ")[0],
    machineCoor = {
        top: 55,
        left: 300
    },
    statusCoor = {
        top: 255,
        left: 300
    };

function animationTemplate(aniSettings) {

    var pointData;

    if (typeof aniSettings.currentRound === "number") {
        pointData = aniSettings.datapoints[aniSettings.currentRound];
    } else {
        pointData = aniSettings;
    }

    var startTopOff = pointData.beginCoor.top + 5,
        startLeftOff = pointData.beginCoor.left + 30,
        endTopOff = machineCoor.top,
        endLeftOff = machineCoor.left,
        highwayPath = pointData.beginCoor.left + 225,
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
                resolve(pointData);
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

    var changeEqu = aniSettings.changeEqu;

    return new Promise(function (resolve) {

        if (typeof aniSettings.y === "number") {
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

    /*the ending coordinates need to be changed */

    /*console.log(aniSettings);

    var newBeginTop = aniSettings.endCoor.top,
        newBeginLeft = aniSettings.endCoor.left,
        newEndTop = aniSettings.beginCoor.top,
        newEndLeft = aniSettings.beginCoor.left;

    console.log(aniSettings);

    aniSettings.endCoor = {
        top: newBeginTop,
        left: newBeginLeft
    };

    aniSettings.beginCoor = {
        top: newEndTop,
        left: newEndLeft
    };

    console.log(aniSettings);*/

    return new Promise(function (resolve) {
        $(equPara)
            .css("animation", 'textDisappear 2s ease-in-out')
            .bind("animationend", function (e) {
                $(equPara).css("opacity", 0);
                katex.render(`${aniSettings.y}`, equPara);
                $(equPara)
                    .css("animation", 'textAppear 1s ease-in-out')
                    .bind("animationend", function (e) {
                        $(equPara).css("opacity", 1);
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
            //            .then(updateRound);
    }
}
