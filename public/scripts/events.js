function startFuncMach() {

    var xinputs = $("input[type='number']"),
        hideAnimationChecked = $("#animate:checked").length > 0,
        hideGraphChecked = $("#showGraph:checked").length > 0,
        graphOpt = {
            callback: function () {
                return new Promise(function (resolve) {
                    resolve("Graph animation is done!");
                });
            },
            animate: hideAnimationChecked,
            showGraph: hideGraphChecked,
            equation: profOpt.equation
        },
        datapoints = [];

    $.each(xinputs, function (i, val) {
        var xval = $(val).val(),
            equation = profOpt.equation;

        if (xval) {
            var replaceX = equation.replace("x", `(${xval})`),
                yval = math.eval(replaceX),
                inputCoor = val.getBoundingClientRect(),
                point = {
                    x: xval,
                    y: yval,
                    updatePoint: true,
                    element: $(`<p>${xval}</p>`)[0],
                    beginCoor: {
                        top: inputCoor.top,
                        left: inputCoor.left
                    },
                    endCoor: {
                        top: 55,
                        right: 300
                    }
                };
            datapoints.push(point);
        }
    });

    animatorControl(datapoints);
}

function checkConfig(val) {
    var profOpt;
    $.each(professorConfigFile, function (i, item) {
        if (item.equation === val) {
            profOpt = item;
        }
    })
    return profOpt;
}

//Dipslay Katex equation
function changePlot(val) {

    window.profOpt = checkConfig(val);

    $(equPara).empty("");
    var y = `y = `,
        equat = `${val}`,
        equPara = $("#functionMachine #equ"),
        yPara = $("#functionMachine #y");

    katex.render(y, yPara[0]);
    katex.render(equat, equPara[0]);
}

/*****DOCUMENT onchange EVENT HANDLER*****/
$("select").change(function (e) {
    changePlot(e.target.value);
});

/****DOCUMENT keydown EVENT HANDLER****/
$(document).keypress(function (e) {
    if (e.which == 13) {
        startFuncMach();
    }
});

/*****GO! Click*****/
$("input[type='button'][value='Go!']").click(function () {
    startFuncMach();
});
