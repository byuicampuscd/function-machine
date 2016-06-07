(function () {
    "use strict";

    /****CHANGE PLOT****/
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

    for (var j = 1; j <= rowCount; j++) {
        input = wand.crtElm("input");
        td1 = wand.crtElm("td");
        td2 = wand.crtElm("td");
        tr = wand.crtElm("tr");

        wand.apndr(td1, input);
        wand.apndr(tr, [td1, td2]);
        wand.apndr(tbody, tr);
    }
}());
