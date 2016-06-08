(function () {
    "use strict";

    var inputOpt = ["input1", "input2", "input3", "input4", "input5", "input6", "input7", "input8", "input9", "input10", "input11", "input12", "input13", "input14", "input15"],
        animateWait = [];

    var lastSheet = document.styleSheets[document.styleSheets.length - 1];
    console.log(lastSheet);

    function animator(aw) {
        var numContainer = wand.querApndr("#numContainer");
        numContainer.innerHTML = "";

        for (var i = 0; i < aw.length; i++) {
            console.log(aw[i].num, aw[i]);
            var nume = wand.crtElm("p", aw[i].num);

            nume.style.position = "absolute";
            nume.style.top = `${aw[i].coorData.top + 7}px`;
            nume.style.left = `${aw[i].coorData.right + 40}px`;

            lastSheet.insertRule(`@keyframes toFuncMachine {
    0% {
        opacity: 0;
        top: ${aw[i].coorData.top + 7}px;
        left: ${aw[i].coorData.right + 40}px;
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

            nume.className = 'toFunc';

            wand.apndr(numContainer, nume);
        }
    }

    /****DOCUMENT ONCHANGE EVENT HANDLER****/
    document.onchange = function (e) {
        if (e.target.localName === "select") {
            changePlot(e.target.value);
        }
    };

    /*****DOCUMENT CLICK HANDLER*****/
    document.onclick = function (e) {
        if (e.target.value === "Go!") {
            animateWait = [];
            for (var i = 0; i < inputOpt.length; i++) {
                var input = wand.querApndr(`[name='${inputOpt[i]}']`);
                if (input.value) {
                    var aniData = {};
                    aniData.coorData = input.getBoundingClientRect();
                    aniData.num = input.value;
                    animateWait.push(aniData);
                }
            }
            animator(animateWait);
        }
    };
}());
