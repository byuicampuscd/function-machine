$(document).ready(function () {

    /*
    Load Query substring
    */
    var queryString = location.search.substring(1),
        vars = queryString.split("&"),
        allQueries = {};

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        allQueries[pair[0]] = pair[1];
    }

    function showProfOptions(profOpt, init) {
        /*
        Append the professor's chosen equations to the application
        */

        var stringifiedData = JSON.stringify(init),
            opt = $("<option></option>").append(profOpt.name);

        $(opt)
            .val(profOpt.equation)
            .attr("data-profOpt", stringifiedData);

        $("select")
            .append(opt);
    }

    /*
    Load the professor configuration file

    general query: ?file=funcMachineSettings&load=general
    */

    $.getJSON(allQueries.file + ".json", function (data) {

        var result;

        if (allQueries.load) {
            result = data[allQueries.load];
        } else {
            result = data.general;
        }

        $("#title").html(result.title);
        $("#instructionText").html(result.instructions);

        window.professorConfigFile = result.equations;

        $.each(result.equations, function (i, profOpt) {

            var init = {
                graphOpt: profOpt
            };

            showProfOptions(profOpt, init);

            /*
            Display the default equation to the function machine
            */
            if (i === 0) {
                //in events.js
                plotGraph.setup(init, "#graph");

                document.querySelector(".graph").firstChild.style.display = "none";

                /*Checkbox onclick event*/
                $("input#showGraph[type='checkbox']").click(e => {
                    var checked = e.target.checked;
                    if (checked) {
                        document.querySelector(".graph").firstChild.style.display = "block";
                    } else {
                        document.querySelector(".graph").firstChild.style.display = "none";
                    }
                })

                changePlot(profOpt.equation);
            }
        });

    }).fail(function () {
        $("#status p").append("Add a query string")
    });

});
