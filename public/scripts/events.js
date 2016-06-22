(function () {
    "use strict";

    //register all inputs on the application
    var inputOpt = document.querySelectorAll("input[type='number'][name*='input']"),
        animateWait = [];

    function startFuncMach() {
        console.log("click");
        animateWait = [];
        for (var i = 0; i < inputOpt.length; i++) {
        console.log("click");
            var input = inputOpt[i];
            console.log(input);
            if (input.value) {
                var aniData = {
                    "coorData": input.getBoundingClientRect(),
                    "num": input.value,
                    "inputTag": input
                };

                animateWait.push(aniData);

                //Make a bigger configuration object here that will be passed through the promise chain.
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
