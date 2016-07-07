$(document).ready(function () {

    /*
    Load the professor configuration file
    */

    $.getJSON("../funcMachineSettings.json", function (result) {

        window.professorConfigFile = result;

        $.each(result, function (i, field) {

            /*
            Append the professor's chosen equations to the application
            */

            var opt = $("<option></option>").append(field.name);

            $(opt).val(field.equation);

            $("select").append(opt);

            /*
            Display the default equation to the function machine
            */

            if (i === 0) {
                changePlot(field.equation);
            }

        });

    });

});
