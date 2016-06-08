var lastSheet = document.styleSheets[document.styleSheets.length - 1];

//Alpha ID is to identify the 15 different animations that could happen in the application
var alphaid = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p'];

//Evaluate the math expression and animate it
function evaluate(equ) {
    console.log(eval(equ));
}

//Change the Katex equation from the selected input box.
function toFuncMachEnd(e) {
    //globalEqu assign in ajax.js
    var equPara = wand.querApndr("#functionMachine p"),
        changeEqu = globalEqu.replace("x", `*${e.target.innerText}`);
    equPara.innerText = "";
    katex.render(changeEqu, equPara);
    evaluate(changeEqu);
}

//Dynamically modify the CSS animations of the 15 input boxes
function animeToFuncMach(nume, aw, id, delay) {
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

    nume.style.animation = `toFuncMachine${id} 3s ease-in-out ${delay[0]}s 1`;

    nume.style.opacity = '0';
    nume.style.zIndex = '100';

    nume.addEventListener("animationend", toFuncMachEnd);

    return nume;
}

//Handle all CSS animations
function animator(aw) {
    var numContainer = wand.querApndr("#numContainer");
    numContainer.innerHTML = "";

    for (var i = 0; i < aw.length; i++) {
        var nume = wand.crtElm("p", aw[i].num);

        var numWithAnime = animeToFuncMach(nume, aw[i].coorData, alphaid[i], [i]);
        wand.apndr(numContainer, numWithAnime);
    }
}
