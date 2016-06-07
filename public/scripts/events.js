/****DOCUMENT ONCHANGE EVENT HANDLER****/
document.onchange = function (e) {
    if (e.target.localName === "select") {
        changePlot(e.target.value);
    }
}

/*****DOCUMENT CLICK HANDLER*****/
document.onclick = function (e) {
    var equationName = e.target.id.indexOf('equation');

    console.log(e.target, equationName);
    console.dir(e.target.getBoundingClientRect());

    if (e.target.id.indexOf('equation') > -1) {
        console.log(e.target.id);
    }
}
