    var config;

    /*AJAX REQUEST TO FUNCMACHINESETTINGS.JS AND LOAD*/
    function disConfig(c) {
        var parsedObj = JSON.parse(c),
            select = wand.crtElm("select");
        for (var i = 0; i < parsedObj.length; i++) {
            console.log(parsedObj[i]);
            var opt = wand.crtElm("option", parsedObj[i].name);
            wand.apndr(select, opt);
            wand.querApndr("#dropdown", select);
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
