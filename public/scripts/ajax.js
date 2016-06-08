    var config;

    function changePlot(val) {
        var equPara = wand.querApndr("#functionMachine p");
        equPara.innerText = "";
        katex.render(val, equPara);
    }

    /*AJAX REQUEST TO FUNCMACHINESETTINGS.JS AND LOAD*/
    function disConfig(c) {
        var parsedObj = JSON.parse(c),
            select = wand.crtElm("select");
        select.name = "equDrop";
        for (var i = 0; i < parsedObj.length; i++) {
            console.log(parsedObj[i]);
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

    function loadConfig(func, search) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                config = xhttp.responseText;
                func(config);
            }
        };
        xhttp.open("GET", search, false);
        xhttp.send();
    }

    loadConfig(disConfig, "../funcMachineSettings.json");
