function startFuncMach() {

    var xinputs = $("input[type='number']"),
        hideAnimationChecked = $("#animate:checked").length > 0,
        hideGraphChecked = $("#showGraph:checked").length > 0,
        graphOpt = {
            callback: function () {
                return Promise.resolve(console.log("Done!"));
            },
            animate: hideAnimationChecked,
            showGraph: hideGraphChecked,
            equation: profOpt.equation
        },
        aniSettings = {
            datapoints: [],
            currentRound: 0
        };

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
                    id: i,
                    changeEqu: profOpt.equation.replace("x", `(${xval})`),
                    updatePoint: true,
                    element: $(`<p>${xval}</p>`)[0],
                    beginCoor: {
                        top: inputCoor.top,
                        left: inputCoor.left
                    },
                    endCoor: {
                        top: 55,
                        left: 300
                    }
                };
            aniSettings.datapoints.push(point);
        }
    });

    animatorControl(aniSettings);
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

    var y = `y = `,
        equat = `${val}`,
        equPara = $("#functionMachine #equ")[0],
        yPara = $("#functionMachine #y");

    $(equPara).empty("");

    katex.render(y, yPara[0]);
    katex.render(equat, equPara);
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
