(function () {
    "use strict";

    function changePlot(a) {
        console.log(a);
    }

    /****TABLE MAKER****/
    var tbody = wand.querApndr("tbody"),
        td1,
        td2,
        tr,
        input,
        rowCount = 15;

    for (var j = 1; j <= 15; j++) {
        input = wand.crtElm("input");
        td1 = wand.crtElm("td");
        td2 = wand.crtElm("td");
        tr = wand.crtElm("tr");

        wand.apndr(td1, input);
        wand.apndr(tr, [td1, td2]);
        wand.apndr(tbody, tr);
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
