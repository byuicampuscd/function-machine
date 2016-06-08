var lastSheet = document.styleSheets[document.styleSheets.length - 1];

var alphaid = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p'];

function modifyAnimeToFunc(nume, aw, numContainer, id, delay) {
    var leftCoorOff = aw.right - 50,
        topCoorOff = aw.top + 7;

    nume.style.position = "absolute";
    nume.style.top = `${topCoorOff}px`;
    nume.style.left = `${leftCoorOff}px`;

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

    wand.apndr(numContainer, nume);
}

function animator(aw) {
    var numContainer = wand.querApndr("#numContainer");
    numContainer.innerHTML = "";

    for (var i = 0; i < aw.length; i++) {
        var nume = wand.crtElm("p", aw[i].num);

        modifyAnimeToFunc(nume, aw[i].coorData, numContainer, alphaid[i], [i]);
    }
}
