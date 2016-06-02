/*************************

This is a custom made library named "wand" that I made to handle some of the functions that I want to do in this application.

-Andrew Gremlich

**************************/

(function (glo, lib) {
    glo.wand = lib();
}(typeof window !== "undefined" ? window : this, function () {
    var lib = {
        apndr: function (a, b) {
            if (typeof a === "object" && typeof b === "object" && !Array.isArray(b)) {
                a.appendChild(b);
            } else if (typeof a !== "object") {
                console.error("First parameter passed is not an object element.");
            } else if (typeof b !== "object") {
                if (typeof b === "string" || typeof b === "number") {
                    a.appendChild(this.txt(b));
                }
            } else if (Array.isArray(b)) {
                var arr = b;
                for (var i = 0; i < arr.length; i++) {
                    this.apndr(a, arr[i]);
                }
            } else {
                console.error("Parameters are not compatible in the lib.apndr function.  Hit the arrow on the left for call stack.");
            }
        },
        querApndr: function (a, b, c) {
            var ele = document.querySelector(a);
            if (ele == null) {
                console.error("No tag exists in the DOM. Hit the arrow on the left for call stack.");
            } else {
                if (Array.isArray(b)) {
                    var arr = b;
                    for (var i = 0; i < arr.length; i++) {
                        this.apndr(ele, this.crtElm(arr[i]));
                    }
                } else if (b) {
                    this.apndr(ele, this.crtElm(b, c));
                }
                return ele;
            }
        },
        querAttr: function (a, b, c) {
            var ele = document.querySelector(a);
            if (ele == null) {
                console.error("No tag exists in the DOM. Hit the arrow on the left for call stack.");
            } else {
                if (b) {
                    ele.setAttribute(b, c);
                }
            }
        },
        txt: function (a) {
            if (typeof a === "string") {
                return document.createTextNode(a);
            } else if (typeof a === "number") {
                return document.createTextNode(a.toString());
            } else {
                console.error("Parameter passed to lib.txt is not a string nor a number.  Hit the arrow on the left for call stack.");
            }
        },
        crtElm: function (a, b) {
            var ele = document.createElement(a),
                txt;
            if (b) {
                if (typeof b === "string") {
                    txt = this.txt(b);
                    this.apndr(ele, txt);
                } else {
                    console.error("Must pass a string as the second param in lib.crtElm function.  Hit the arrow on the left for call stack.");
                }
            }
            return ele;
        }
    }
    return lib;
}));
