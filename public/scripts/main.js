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

    for (var j = 1; j <= rowCount; j++) {
        input = wand.crtElm("input");
        td1 = wand.crtElm("td");
        td2 = wand.crtElm("td");
        tr = wand.crtElm("tr");

        wand.apndr(td1, input);
        wand.apndr(tr, [td1, td2]);
        wand.apndr(tbody, tr);
    }

    /****DROPDOWN MAKER****/
    var mathfunc = [
          `x^2`,
          `x^2`,
          `x^2`,
          `x^2`,
          `x^2`,
          `x^3`
       ];

    for (var i = 0; i < mathfunc.length; i++) {
        var equDiv = wand.crtElm("div");
        equDiv.id = "equation" + i;
        katex.render(mathfunc[i], equDiv);
        var dropdown = wand.querApndr("#dropdown");
        wand.apndr(dropdown, equDiv);
    }

    /****DOCUMENT ONCHANGE EVENT HANDLER****/
    document.onchange = function (e) {
        if (e.target.localName === "select") {
            changePlot(e.target.value);
        }
    }

    /*****DOCUMENT CLICK HANDLER*****/
    document.onclick = function (e) {
        console.log(e.target);
        if (e.target.id.indexOf('equation') > 0) {
            console.log(e.target.id);
        }
    }
}());
