    $(document).ready(function () {

        $.getJSON("../funcMachineSettings.json", function (result) {

            window.professorConfigFile = result;

            $.each(result, function (i, field) {

                var opt = $("<option></option>").append(field.name);

                $(opt).val(field.equation);

                $("select").append(opt);

                if (i === 0) {
                    changePlot(field.equation);
                }

            });

        });

    });
