var lastSheet = document.styleSheets[document.styleSheets.length - 1];

// TODO: Function machine in

//Alpha ID is to identify the different animations that could happen in the application
var alphaid = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
    statusBar = wand.querApndr("#status p"),
    startingData = [];

/********"CONSTRUCTOR" (not exactly) functions**********/
function aniConfig(begCoorData, endCoorData, num, alphaid, i) {
    var animateConfig = {};
    animateConfig.begCoorData = begCoorData;
    animateConfig.endCoorData = endCoorData;
    animateConfig.num = num;
    animateConfig.alphaid = alphaid;
    animateConfig.delay = i;
    return animateConfig;
}

function animationTemplate(animateConfig) {
    "use strict";
    var startTopOff = animateConfig.begCoorData.top + 5,
        startRightOff = animateConfig.begCoorData.right - 30,
        endTopOff = animateConfig.endCoorData.top,
        endRightOff = animateConfig.endCoorData.right,
        highwayPath = 246,
        numContainer = wand.querApndr("#numContainer");
    animateConfig.num.style.position = "absolute";
    animateConfig.num.style.top = `${startTopOff}px`;
    animateConfig.num.style.left = `${startRightOff}px`;
    wand.apndr(numContainer, animateConfig.num);
    lastSheet.insertRule(`@keyframes toFuncMachine${animateConfig.alphaid} {
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
    animateConfig.num.style.animation = `toFuncMachine${animateConfig.alphaid} 3s ease-in-out ${animateConfig.delay*14}s`;
    animateConfig.num.style.opacity = '0';
    animateConfig.num.style.zIndex = '100';

    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve(animateConfig.num);
        }, animateConfig.delay * 3000);
    });
}

/************ANIMATION FUNCTIONS**********************/
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
            if (typeof changeEqu === "number") {
                statusBar.innerText = "";
                statusBar.innerText = ">> Returning answer.";
            }
            equPara.innerHTML = "";
            equPara.style.opacity = 0;
            katex.render(`${changeEqu}`, equPara);
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
            changeEqu = globalEqu.replace("x", `*(${num.innerText})`);

            statusBar.innerText = "";
            statusBar.innerText = ">> Calculating";

            setTimeout(function () {
                equPara.style.animation = 'textDisappear 1.5s ease-in-out';
                resolve(changeEqu);
            }, 1500);
        } else if (typeof num === "string") {
            changeEqu = math.eval(num);

            setTimeout(function () {
                equPara.style.animation = 'textDisappear 1.5s ease-in-out';
                resolve(changeEqu);
            }, 1500);
        } else {
            return;
        }
    });
}

function createAns(ans) {
    "use strict";
    var numContainer = wand.querApndr("#numContainer"),
        num = wand.crtElm("p", ans.toString());
    numContainer.innerHTML = "";

    return new Promise(function (resolve) {
        setTimeout(function () {
            var funcMachCoor = {
                    top: 55,
                    right: 300
                },
                endCoorData = {};

            endCoorData.top = startingData[0].top + 7.5;
            endCoorData.right = startingData[0].right;

            var animateConfig = aniConfig(funcMachCoor, endCoorData, num, 'zz', 0);

            startingData.pop();
            resolve(animateConfig);
        }, 1500);
    });
}

function animate(i, aw) {
    var num = wand.crtElm("p", aw[i].num),
        funcMachCoor = {
            top: 55,
            right: 300
        },
        animateConfig = aniConfig(aw[i].coorData, funcMachCoor, num, alphaid[i], i),
        numberInput = aw[i].inputTag.name.match(/\d+/);

    startingData.push(aw[i].coorData);

    animationTemplate(animateConfig)
        .then(equAnimeDisappear)
        .then(equAppear)
        .then(equAnimeDisappear)
        .then(equAppear)
        .then(createAns)
        .then(animationTemplate)
        .then(function (yval) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    var td = wand.querApndr(`#row${(numberInput[0]*1)} td:nth-child(2)`),
                        y = `y = `,
                        equat = `${globalEqu}`,
                        yvalue = yval.innerText,
                        statusBarCoor = {
                            top: 150,
                            right: 400
                        }
                    animateConfig;

                    katex.render(y, yPara);
                    katex.render(equat, equPara);
                    wand.apndr(td, yvalue);

                    animateConfig = aniConfig(aw[i].coorData, statusBarCoor, yval, "za", 0);

                    statusBar.innerText = "";
                    statusBar.innerText = ">> Plotting answer.";

                    resolve(animateConfig);
                }, 3000);
            });
        })
        .then(animationTemplate);
}

//Handle all CSS animations
function animatorControl(aw, ani) {
    "use strict";
    var numContainer = wand.querApndr("#numContainer");
    numContainer.innerHTML = "";

    for (var i = 0; i < aw.length; i++) {
        animate(i, aw);
    }
}
