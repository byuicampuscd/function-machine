var lastSheet = document.styleSheets[document.styleSheets.length - 1];

// TODO: Function machine in

//Alpha ID is to identify the different animations that could happen in the application
var alphaid = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
    statusBar = wand.querApndr("#status p");

function animateToStatusBar() {
    console.log("Animate to status bar and pass the information to the graph function");

    //Show graph checkbox
    //Animation checkbox
    //Equation
    //Window limits
    //X and Y value

    //graphIt();
}

function equAppear(changeEqu) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            equPara.innerHTML = "";
            equPara.style.opacity = 0;
            katex.render(`y = ${changeEqu}`, equPara);
            equPara.style.animation = 'textAppear 1s ease-in-out';
            equPara.style.opacity = 1;
            resolve(changeEqu);
        }, 1500);
    });
}

function equAnimeDisappear(num) {
    "use strict";
    return new Promise(function (resolve) {
        var changeEqu;

        if (typeof num === "object") {
            changeEqu = globalEqu.replace("x", `*${num.innerText}`);

            statusBar.innerText = "";
            statusBar.innerText = ">> Calculating";
        } else if (typeof num === "string") {
            changeEqu = math.eval(num);
        }

        setTimeout(function () {
            equPara.style.animation = 'textDisappear 1.5s ease-in-out';
            resolve(changeEqu);
        }, 3000);
    });
}

function animationTemplate(startingCoor, endingCoor, num, alphaid, delay) {
    "use strict";
    return new Promise(function (resolve) {
        var startTopOff = startingCoor.top + 5,
            startRightOff = startingCoor.right - 30,
            endTopOff = endingCoor.top,
            endRightOff = endingCoor.right,
            highwayPath = 246;
        num.style.position = "absolute";
        num.style.top = `${startTopOff}px`;
        num.style.left = `${startRightOff}px`;
        lastSheet.insertRule(`@keyframes toFuncMachine${alphaid} {
                            0% {
                                opacity: 0;
                                top: ${startTopOff}px;
                                left: ${startRightOff}px;
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
                                left: ${endRightOff}px;
                            }
                        }`, lastSheet.cssRules.length);
        num.style.animation = `toFuncMachine${alphaid} 3s ease-in-out ${delay*7}s`;
        num.style.opacity = '0';
        num.style.zIndex = '100';
        window.setTimeout(function () {
            resolve(num);
        }, delay * 3000);
    });
}

//Handle all CSS animations
function animatorControl(aw) {
    "use strict";
    var numContainer = wand.querApndr("#numContainer");
    numContainer.innerHTML = "";

    for (var i = 0; i < aw.length; i++) {
        var num = wand.crtElm("p", aw[i].num);
        var endingCoor = {
            top: 55,
            right: 300
        };

        animationTemplate(aw[i].coorData, endingCoor, num, alphaid[i], i)
            .then(equAnimeDisappear)
            .then(equAppear)
            .then(equAnimeDisappear)
            .then(equAppear);

        wand.apndr(numContainer, num);
    }
}
