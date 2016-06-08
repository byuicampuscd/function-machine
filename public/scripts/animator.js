var lastSheet = document.styleSheets[document.styleSheets.length - 1];

    function animator(aw) {
        var numContainer = wand.querApndr("#numContainer");
        numContainer.innerHTML = "";

        for (var i = 0; i < aw.length; i++) {
            console.log(aw[i].num, aw[i]);
            var nume = wand.crtElm("p", aw[i].num);

            nume.style.position = "absolute";
            nume.style.top = `${aw[i].coorData.top + 7}px`;
            nume.style.left = `${aw[i].coorData.right + 46}px`;

            lastSheet.insertRule(`@keyframes toFuncMachine {
                            0% {
                                opacity: 0;
                                top: ${aw[i].coorData.top + 7}px;
                                left: ${aw[i].coorData.right + 46}px;
                            }
                            10% {
                                opacity: 1;
                            }
                            33% {
                                top: ${aw[i].coorData.top + 7}px;
                                left: 240px;
                            }
                            66% {
                                top: 45px;
                                left: 240px;
                            }
                            90% {
                                opacity: 1;
                            }
                            100% {
                                opacity: 0;
                                top: 45px;
                                left: 300px;
                            }
                        }`, lastSheet.cssRules.length);
            console.log(lastSheet);

            nume.style.animation = 'toFuncMachine 3s ease-in-out 0.25s 1';
            nume.style.opacity = '0';
            nume.style.zIndex = '100';

            wand.apndr(numContainer, nume);
        }
    }
