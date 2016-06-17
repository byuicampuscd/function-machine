(function () {
    "use strict";

    //register all inputs on the application
    var inputOpt = ["input1", "input2", "input3", "input4", "input5", "input6", "input7", "input8", "input9", "input10", "input11", "input12", "input13", "input14", "input15", "input16", "input17", "input18", "input19"],
        animateWait = [];

    function startFuncMach() {
        animateWait = [];
        for (var i = 0; i < inputOpt.length; i++) {
            var input = wand.querApndr(`[name='${inputOpt[i]}']`);
            if (input.value) {
                var aniData = {};
                aniData.coorData = input.getBoundingClientRect();
                aniData.num = input.value;
                aniData.inputTag = input;
                animateWait.push(aniData);

                //graphConfig located in AJAX.js
                graphConfig.aniData = aniData
            }
        }
        animatorControl(animateWait);
    }

    /*****DOCUMENT onchange EVENT HANDLER*****/
    document.onchange = function(e) {
        if (e.target.localName === "select") {
            changePlot(e.target.value);
        }
    }

    /****DOCUMENT keydown EVENT HANDLER****/
    document.onkeydown = function (e) {
        if (e.keyCode === 13) {
            startFuncMach()
        }
    }

    /*****DOCUMENT CLICK HANDLER*****/
    document.onclick = function (e) {
        if (e.target.value === "Go!") {
            startFuncMach()
        }
    };
}());
