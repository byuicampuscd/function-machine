(function () {
    "use strict";

    function changePlot(a) {
        console.log(a);
    }


    /****DROPDOWN MAKER****/
    wand.querApndr('#dropdown', 'select');

    var mathfunc = [
          'x^2',
          'x^3'
       ];

    for (var i = 0; i < mathfunc.length; i++) {
        wand.querApndr('select', 'option', mathfunc[i]);
    }

    /****DOCUMENT ONCHANGE EVENT HANDLER****/
    document.onchange = function (e) {
        console.log(e);
        if (e.target.localName === "select") {
            changePlot(e.target.value);
        }
    }
}());
