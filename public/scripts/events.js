function startFuncMach() {
    var xinputs = $("input[type='number']"),
        graphConfig = [],
        hideAnimationChecked = $("#animate:checked").length > 0,
        hideGraphChecked = $("#showGraph:checked").length > 0,
        graphOpt = {
            callback: fun,
            animate: hideAnimationChecked,
            showGraph: hideGraphChecked,
            equation: '3x+2',
            window: {
                x: {
                    min: -10,
                    max: 10
                },
                y: {
                    min: -10,
                    max: 10
                }
            },
        };

    console.log(hideAnimationChecked, hideGraphChecked);

    $.each(xinputs, function (i, val) {
        console.log(i, $(val).val() * 1);
        var graphOpt = {
            data: [{
                x: 5,
                y: 17,
                updatePoint: true
                }, {
                x: 2,
                y: 8,
                updatePoint: true
            }]
        };
    });

}

//Dipslay Katex equation
function changePlot(val) {
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
