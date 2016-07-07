(function () {
    "use strict";

    /*
    Make the whole table and cells for the input boxes and user interaction.
    */
    var tbody = $("tbody"),
        td1,
        td2,
        tr,
        input,
        rowCount = 19;

    for (var j = 1; j <= rowCount; j++) {
        input = $("<input>");
        td1 = $("<td></td>");
        td2 = $("<td></td>");
        tr = $("<tr></tr>");

        $(tr).attr("id", `row${j}`);

        $(input).attr("name", `input${j}`).attr("type", "number");

        $(td2).attr("id", `yval${j}`);

        $(td1).append(input);
        $(tr).append(td1).append(td2);
        $(tbody).append(tr);
    }
}());
