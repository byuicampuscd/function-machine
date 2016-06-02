(function () {
    "use strict";

    function changePlot(a) {
       console.log(a);
    }

    var dropdownContain = wand.quer('#dropdown', 'select'),
       select = wand.crtElm('select'),
       mathfunc = [
          'x^2',
          'x^3'
       ];

    wand.apndr(dropdownContain, select);

    for (var i = 0; i < mathfunc.length; i++) {
       wand.quer('#dropdown select', 'option');
       var opt = wand.crtElm('option', mathfunc[i]);
       wand.apndr(select, opt);
    }

    document.onchange = function (e) {
       console.log(e);
       if (e.target.localName === "select") {
          changePlot(e.target.value);
       }
    }
 }());
