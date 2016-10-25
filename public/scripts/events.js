/*
Set up the basic variables.
*/
var xMemory = [],
	inputs = document.querySelectorAll("input[type='number']"),
	inputCount = inputs.length,
	runMaster = true,
	run = true;

/*
Attach an oninput event to all the input boxes in order to validate them within the bounds
that the professor has chosen.  If the bounds are exceeded, then disable the "Go!" button
and output a message to the status bar.
*/
for (var i = 0; i < inputs.length; i++) {

	inputs[i].onkeyup = e => {

		var xInputVal = e.srcElement.value;

		if (e.which === 69) {
			console.log(xInputVal);
			e.target.value = "";
			$("#status p").html(`Can't do that bro!`);
		}
	};
}

/*
Function to select the chosen equation with its name and graph window boundaries.
*/
function checkConfig(val) {
	var profOpt;
	$.each(professorConfigFile, function (i, item) {
		if (item.equation === val) {
			profOpt = item;
		}
	})
	return profOpt;
}

/*
Upon choosing another equation to graph, clear all the values
*/
function clearValues() {
	var xinputs = $("input[type='number']"),
		yinputs = $(`tr td:nth-of-type(2)`);

	xinputs.each(function (i, item) {
		item.value = "";
	});

	yinputs.each(function (i, item) {
		item.innerHTML = "";
	});
}

/*
Dipslay Katex equation. ALSO used in ajax.js
*/
function changePlot(val) {

	xMemory = [];

	clearValues();

	window.profOpt = checkConfig(val);

	var equat = val,
		equPara = $("#functionMachine #equ")[0];

	$(equPara).empty();

	if (window.profOpt.hideEquation === false) {
		katex.render(window.profOpt.latex, equPara);
	} else if (window.profOpt.hideEquation === true) {
		$(equPara)
			.append("<h2>Mystery Equation</h2>")
			.css({
				"paddingTop": "5px",
			});
	}
}

/*
Animation path for the stairstep
*/
function stairStep(options) {
	"use strict";
	var highwayPath = 280,
		lastSheet = document.styleSheets[document.styleSheets.length - 1];
	lastSheet.insertRule(`@keyframes ${options.name} {
                            0% {
                                opacity: 1;
                                top: ${options.startTopOff}px;
                                left: ${options.startLeftOff}px;
                            }
                            10% {
                                opacity: 1;
                            }
                            33% {
                                top: ${options.startTopOff}px;
                                left: ${highwayPath}px;
                            }
                            66% {
                                top: ${options.endTopOff}px;
                                left: ${highwayPath}px;
                            }
                            90% {
                                opacity: 1;
                            }
                            100% {
                                opacity: 0;
                                top: ${options.endTopOff}px;
                                left: ${options.endLeftOff}px;
                            }
                        }`, lastSheet.cssRules.length);
}

/*
A set of functions using the stairstep animation template
to create pathways with coordinate data
*/
function makeXToMachine(inputCords, index) {
	"use strict";
	stairStep({
		startTopOff: inputCords.top + 10,
		startLeftOff: inputCords.left + 30,
		endTopOff: 150,
		endLeftOff: 450,
		name: `xToMachine${index}`
	});
}

function makeMachineToY(inputCords, index) {
	"use strict";
	stairStep({
		startTopOff: 200,
		startLeftOff: 630,
		endTopOff: inputCords.top + 10,
		endLeftOff: inputCords.right + 5,
		name: `machineToY${index}`
	});
}

function makeYToStatusBar(inputCords, index) {
	"use strict";
	stairStep({
		startTopOff: inputCords.top + 5,
		startLeftOff: inputCords.right + 10,
		endTopOff: 50,
		endLeftOff: 400,
		name: `yToStatusBar${index}`
	});
}

/*
Set up the xMemory array and the animation paths for each input box.

NOTE: Setting up the xMemory array also makes it so that no animations
      are repeated by multiple clicks on the "Go!" button.
*/
for (var i = 0; i < inputCount; i++) {
	xMemory[i] = null;

	var inputCoor = inputs[i].getBoundingClientRect();

	makeXToMachine(inputCoor, i);
	makeMachineToY(inputCoor, i);
	makeYToStatusBar(inputCoor, i);
	$("#numContainer").append($(`<p></p>`));
}

function UserException(message, errorNum) {
	this.message = message;
	this.errorNum = errorNum;
	this.name = "UserException";
}

/*
Set up the object that will be passed through the promise chain
in animator control.
*/
function setUpObject(xinputs, graphOpt, aniSettings) {
	xinputs.each(function (i) {

		var xvalue = $(this).val(),
			xval,
			roundit;

		if (xvalue) {
			xval = +xvalue;
			roundit = xval.toFixed(profOpt.rounding);

			$(this).val(roundit);

			if (profOpt.view.x.min <= roundit && roundit <= profOpt.view.x.max) {
				try {
					var replaceX = graphOpt.equation.replace(/x/g, `(${roundit})`),
						yval = math.eval(replaceX),
						inputCoor = this.getBoundingClientRect(),
						point = {
							x: roundit,
							y: yval.toFixed(profOpt.rounding),
							id: i,
							changeEqu: profOpt.equation.replace("x", `(${roundit})`),
							updatePoint: xMemory[i] !== roundit,
							element: $("#numContainer p").get(i)
						};

				} catch (e) {
					$("#status p")
						.html(`Error! ${xvalue} is out of domain`)
						.css({
							"fontWeight": "bold",
							"color": "#b62727"
						});
				}

				/*
				Clear out the Ys when they don't equal each other and need to be updated
				*/
				if (point.updatePoint) {
					$(`td#yval${i + 1}`).html("");
				}

				/*Update the xmemory*/
				xMemory[i] = roundit;
				aniSettings.datapoints.push(point);
			} else {
				throw new UserException("Out of window", xvalue);
			}
		}
	});

	console.log(aniSettings);
}

/*
Set all the data that will be set to aniSettings in the setUpObject function

NOTE
graphOpt.callback still needs a viable method!
*/
function startFuncMach() {

	var xinputs = $("input[type='number']"),
		graphOpt = {
			equation: profOpt.equation,
			hideEquation: profOpt.hideEquation,
			view: profOpt.view,
			duration: aniDuration
		},
		aniSettings = {
			datapoints: [],
			currentRound: 0,
			graphOpt: graphOpt
		};

	try {
		setUpObject(xinputs, graphOpt, aniSettings);
		animatorControl(aniSettings);
	} catch (e) {
		console.log(e);
		xMemory = [];
		$("#status p")
			.html(`${e.errorNum} x-value out of window.`)
			.css({
				"fontWeight": "bold",
				"color": "#b62727"
			});
	}
}

/*Before running the function machine, put all inputs next to each other.*/
function cleanInputs() {
	var xinputs = $("input[type='number']"),
		inputArray = [];

	xinputs.each(function (i) {
		var inputValue = $(this).val();

		if (inputValue !== "") {
			inputArray.push(inputValue);
			$(this).val("");
		}
	})

	xinputs.each(function (i) {
		if (i < inputArray.length) {
			$(this).val(inputArray[i]);
		} else {
			$(this).val("");
		}
	})
}

$("#closeHelp").click(e => {
	$(e.target.parentElement).fadeOut(100);
	$("#shade").fadeOut(200);
	localStorage['firstTimeFunctionMachine'] = false;
});

$("#openHelp").click(e => {
	$("#instructions").fadeIn(100);
	$("#shade").fadeIn(1000);
});

$(document).ready(e => {
	try {
		var firsttime = localStorage['firstTimeFunctionMachine'];
	} catch (e) {
		console.error(e);
	}
	if (firsttime === "false") {
		$("#instructions").hide();
		$("#shade").hide();
	}
})

/*
Onchange event handler for the select html element.
*/
$("select").change(function (e) {
	var selected = $(`option[value="${e.target.value}"]`),
		profOpt = JSON.parse(selected.attr("data-profopt"));

	plotGraph.setup(profOpt, "#graph")
	changePlot(e.target.value);
});

/*
DOCUMENT keydown event handler
*/
$(document).keypress(function (e) {
	if (e.which == 13 && runMaster) {
		cleanInputs();
		startFuncMach();
	}
});

/*
GO! Click event handler
*/
$("input[type='button'][value='Go!']").click(function () {
	if (runMaster) {
		cleanInputs();
		startFuncMach();
	}
});
