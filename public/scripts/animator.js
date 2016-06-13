var lastSheet = document.styleSheets[document.styleSheets.length - 1];

// TODO: Function machine in
// TODO: Make sure the do the animations on the text

//Alpha ID is to identify the 15 different animations that could happen in the application
var alphaid = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
    statusBar = wand.querApndr("#status p");

function equAnimeDisappear(ele, changeEqu, func, state) {
    "use strict";
    var e = ele;
    e.style.animation = 'textDisappear 1.5s ease-in-out';
    ele.addEventListener("animationend", function () {
        equPara.innerText = "";
        func(e, changeEqu, state);
    });
}

function equAnimeAppear(ele, changeEqu, state) {
    "use strict";
    var e = ele;
    e.style.opacity = 0;
    katex.render(`y = ${changeEqu}`, equPara);
    e.style.animation = 'textAppear 1s ease-in-out';
    e.addEventListener("animationend", function () {
        e.style.opacity = 1;

        if (state === "final") {
            statusBar.innerText = "";
            wand.apndr(statusBar, ">> Finished Calculations");
            return;
        } else if (state !== "stop") {
            var evalNum = math.eval(changeEqu);
            equAnimeDisappear(ele, evalNum, equAnimeAppear, "stop");
        } else {
            equAnimeDisappear(ele, globalEqu, equAnimeAppear, "final");
        }
    })
}

//Change the Katex equation from the selected input box.
function toFuncMachEnd(e) {
    "use strict";
    //globalEqu and equPara assigned in ajax.js
    var changeEqu = globalEqu.replace("x", `*${e.target.innerText}`);
    equAnimeDisappear(equPara, changeEqu, equAnimeAppear);

    wand.apndr(statusBar, "");
    wand.apndr(statusBar, ">> Calculating");
}

//Dynamically modify the CSS animations of the 15 input boxes
function animeToFuncMach(nume, aw, id, delay) {
    "use strict";
    var leftCoorOff = aw.right - 50,
        topCoorOff = aw.top + 7;
    nume.style.position = "absolute";
    nume.style.top = `${topCoorOff}px`;
    nume.style.left = `${leftCoorOff}px`;
    nume.className = `anime${id}`
    lastSheet.insertRule(`@keyframes toFuncMachine${id} {
                            0% {
                                opacity: 0;
                                top: ${topCoorOff}px;
                                left: ${leftCoorOff}px;
                            }
                            10% {
                                opacity: 1;
                            }
                            33% {
                                top: ${topCoorOff}px;
                                left: 240px;
                            }
                            66% {
                                top: 55px;
                                left: 240px;
                            }
                            90% {
                                opacity: 1;
                            }
                            100% {
                                opacity: 0;
                                top: 55px;
                                left: 300px;
                            }
                        }`, lastSheet.cssRules.length);
    nume.style.animation = `toFuncMachine${id} 3s ease-in-out ${delay[0]*7}s 1`;
    nume.style.opacity = '0';
    nume.style.zIndex = '100';
    nume.addEventListener("animationend", toFuncMachEnd);
    return nume;
}

//Handle all CSS animations
function animator(aw) {
    "use strict";
    var numContainer = wand.querApndr("#numContainer");
    numContainer.innerHTML = "";

    for (var i = 0; i < aw.length; i++) {
        var nume = wand.crtElm("p", aw[i].num);

        var numWithAnime = animeToFuncMach(nume, aw[i].coorData, alphaid[i], [i]);
        wand.apndr(numContainer, numWithAnime);
    }
}
