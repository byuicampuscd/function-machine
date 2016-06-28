var statusBar = $("#status p"),
    lastSheet = document.styleSheets[document.styleSheets.length - 1];;

function PromiseInit(arr) {
    return Promise.resolve(arr);
}

function animationTemplate(pointData) {
    "use strict";

    console.log(pointData);

    var startTopOff = pointData.beginCoor.top + 5,
        startLeftOff = pointData.beginCoor.left + 30,
        endTopOff = pointData.endCoor.top,
        endLeftOff = pointData.endCoor.left,
        highwayPath = 246,
        numContainer = $("#numContainer"),
        numPara = pointData.element;

    $(numPara)
        .css("position", "absolute")
        .css("top", `${startTopOff}px`)
        .css("left", `${startLeftOff}px`);

    $(numContainer).append(numPara);

    /*
    lastSheet.insertRule(`@keyframes toFuncMachine${pointData.alphaid} {
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

    $(numPara)
        .css("animation", `toFuncMachine${pointData.alphaid} 3s ease-in-out`)
        .css("opacity", `0`)
        .css("zIndex", `100`);

    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve(pointData.num);
        }, pointData.delay * 3000);
    });
    */

}

//Handle all CSS animations
function animatorControl(dps) {
    "use strict";
    var numContainer = $("#numContainer");

    numContainer.innerHTML = "";

    for (var i = 0; i < dps.length; i++) {
        PromiseInit(dps[i])
            .then(animationTemplate);
    }
}
