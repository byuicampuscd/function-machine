$(document).ready(function () {

    /*
    Load Query substring
    */
    var queryString = location.search.substring(1),
        query = queryString.split("=")[1] + ".json";

    console.log(query);

    function showProfOptions(field) {
        /*
        Append the professor's chosen equations to the application
        */

        var opt = $("<option></option>").append(field.name);

        $(opt).val(field.equation);

        $("select").append(opt);
    }

    /*
    Load the professor configuration file
    */

    $.getJSON(query, function (result) {

        window.professorConfigFile = result;

        $.each(result, function (i, field) {

            showProfOptions(field);

            /*
            Display the default equation to the function machine
            */

            if (i === 0) {
                changePlot(field.equation);
            }

        });

    });

});
