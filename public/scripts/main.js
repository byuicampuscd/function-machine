(function () {
    "use strict";

    /****TABLE MAKER****/
    var tbody = wand.querApndr("tbody"),
        td1,
        td2,
        tr,
        input,
        rowCount = 19;

    for (var j = 1; j <= rowCount; j++) {
        input = wand.crtElm("input");
        td1 = wand.crtElm("td");
        td2 = wand.crtElm("td");
        tr = wand.crtElm("tr");

        input.name = `input${j}`;
        input.type = 'number';

        wand.apndr(td1, input);
        wand.apndr(tr, [td1, td2]);
        wand.apndr(tbody, tr);
    }
}());
