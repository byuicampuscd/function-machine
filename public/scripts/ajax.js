$(document).ready(function () {

    /*
    Load Query substring
    */
    var queryString = location.search.substring(1),
        query = queryString.split("=")[1] + ".json";

    function showProfOptions(profOpt) {
        /*
        Append the professor's chosen equations to the application
        */

        var opt = $("<option></option>").append(profOpt.name);

        $(opt).val(profOpt.equation);

        $("select").append(opt);
    }

    /*
    Load the professor configuration file
    */

    $.getJSON(query, function (result) {

        window.professorConfigFile = result;

        $.each(result, function (i, profOpt) {

            showProfOptions(profOpt);

            /*
            Display the default equation to the function machine
            */

            if (i === 0) {
                //in events.js
                changePlot(profOpt.equation);
            }

        });

    }).fail(function() {
        $("#status p").append("Add a query string")
    });;

});
