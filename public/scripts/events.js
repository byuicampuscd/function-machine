(function () {
    "use strict";

    var inputOpt = ["input1", "input2", "input3", "input4", "input5", "input6", "input7", "input8", "input9", "input10", "input11", "input12", "input13", "input14", "input15"];

    var animateWait = [];

    /****DOCUMENT ONCHANGE EVENT HANDLER****/
    document.onchange = function (e) {
        if (e.target.localName === "select") {
            changePlot(e.target.value);
        }
    };

    /*****DOCUMENT CLICK HANDLER*****/
    document.onclick = function (e) {
        if (e.target.value === "Go!") {
            for (var i = 0; i < inputOpt.length; i++) {
                var input = wand.querApndr(`[name='${inputOpt[i]}']`);
                if (input.value) {
                    var aniData = {};
                    aniData.coorData = input.getBoundingClientRect();
                    aniData.num = input.value;
                    console.log(aniData);
                    animateWait.push(aniData);
                }
            }
                    console.log(animateWait);
        }
    };
}());
