    var config,
        globalEqu,
        equPara = wand.querApndr("#functionMachine #equ"),
        yPara = wand.querApndr("#functionMachine #y"),
        graphConfig = {};

    //Dipslay Katex equation
    function changePlot(val) {
        equPara.innerText = "";
        var y = `y = `,
            equat = `${val}`;
        katex.render(y, yPara);
        katex.render(equat, equPara);
        globalEqu = val;

        //graphConfig located in animator.js line 9
        graphConfig.equation = equat;
    }

    /*AJAX REQUEST TO FUNCMACHINESETTINGS.JS AND LOAD*/
    function dispConfig(c) {
        var parsedObj = JSON.parse(c),
            select = wand.crtElm("select");
        select.name = "equDrop";
        for (var i = 0; i < parsedObj.length; i++) {
            var opt = wand.crtElm("option", parsedObj[i].name);
            opt.value = parsedObj[i].equation;
            //          opt.class = JSON.stringify(parsedObj[i].window);
            wand.apndr(select, opt);
            wand.querApndr("#dropdown", select);
            if (i === 0) {
                changePlot(parsedObj[i].equation);
            }
        }
    }

    //Load in the configuration file
    function loadConfig(func, search) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                config = xhttp.responseText;
                func(config);
                graphConfig.appConfig = JSON.parse(config);
            }
        };
        xhttp.open("GET", search, true);
        xhttp.send();
    }

    loadConfig(dispConfig, "../funcMachineSettings.json");
