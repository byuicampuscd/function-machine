var equPara = $("#functionMachine #equ")[0],
	rangeSpeed = $("#animate").val(),
	aniDuration = (1 * 5) / rangeSpeed;

$('#animate').change(e => {
	aniDuration = (1 * 5) / e.target.value;
})

function runAnimation(name, value) {
	/*
	This is a function factory which will grab the
	necessary data and then return the function promise
	*/
	return function animation(aniSettings) {
		"use strict";
		var datapoint = aniSettings.datapoints[aniSettings.currentRound],
			numPara = datapoint.element;

		/*
		Make the promise that when the dynamic
		animation path is done then this promise is finished
		*/
		return new Promise(function (resolve) {
			$(numPara)
				.html(value)
				.css({
					"animation": `${name}${aniSettings.currentRound} ${aniDuration}s ease-in-out`,
				})
				.one('animationend', function (e) {
					resolve(aniSettings);
				});
		});
	};
}

function statusMessage(message) {
	"use strict";
	/*
	This is a function factory which will grab the
	necessary data and then return the function promise
	*/
	var statusBar = $("#status p");

	statusBar
		.html('')
		.css({
			"fontWeight": "normal",
			"color": "black"
		});

	return function (aniSettings) {
		return new Promise(function (resolve) {
			statusBar.html(message);
			resolve(aniSettings);
		});

	};
}

function replaceXEqu(aniSettings) {
	"use strict";

	/*
	Replace the x in the disappeared equation without having the y disappear.
	*/
	return new Promise(function (resolve) {
		if (aniSettings.graphOpt.hideEquation) {
			resolve(aniSettings);
		} else {
			$(equPara)
				.css("animation", `textDisappear ${aniDuration*0.5}s ease-in-out`)
				.one("animationend", function (e) {
					$(equPara).css("opacity", 0);
					resolve(aniSettings);
				});
		}
	});
}

function showEvaluateEqu(aniSettings) {
	"use strict";

	/*
	Get the y answer and the x-changed equation
	*/
	var pointData = aniSettings.datapoints[aniSettings.currentRound],
		changeEqu = pointData.changeEqu;

	/*
	Show the new equation with the replaced x-value equation
	*/
	return new Promise(function (resolve) {
		if (aniSettings.graphOpt.hideEquation) {
			resolve(aniSettings);
		} else {
			katex.render(`${changeEqu}`, equPara);
			$(equPara)
				.css("animation", `textAppear ${aniDuration*0.5}s ease-in-out`)
				.one("animationend", function (e) {
					$(equPara).css("opacity", 1);
					resolve(aniSettings);
				})
		}
	});
}

function showYAns(aniSettings) {
	"use strict";

	/*
	Get the current round and current data points
	*/
	var pointData = aniSettings.datapoints[aniSettings.currentRound];

	/*
	Animate the new y value to the coordinated y column and once
	animation is done then return the promise
	*/
	return new Promise(function (resolve) {
		if (aniSettings.graphOpt.hideEquation) {
			resolve(aniSettings);
		} else {
			$(equPara)
				.css("animation", `textDisappear ${aniDuration*0.5}s ease-in-out`)
				.one("animationend", function () {
					$(equPara).css("opacity", 0);
					katex.render(`${pointData.y}`, equPara);
					resolve(aniSettings);
				});
		}
	});
}

/*
Show the chosen equation to graph
*/
function showEquationAgain(aniSettings) {
	return new Promise(function (resolve) {
		if (aniSettings.graphOpt.hideEquation) {
			resolve(aniSettings);
		} else {
			$(equPara)
				.css("animation", `textAppear ${aniDuration*0.5}s ease-in-out`)
				.one("animationend", function (e) {
					$(equPara).css("opacity", 1);
					resolve(aniSettings);
				});
		}
	});
}

/*
Once the y-value appears in the correct y-column then fulfill the promise.
*/
function placeYValue(aniSettings) {
	"use strict";
	var pointData = aniSettings.datapoints[aniSettings.currentRound];
	return new Promise(function (resolve) {
		var input = $(`td#yval${pointData.id + 1}`)[0];
		$(input).html("");
		$(input).append(`<p>${pointData.y}</p>`);
		resolve(aniSettings);
	});
}

/*
Once the equation is cleared and reset to the default equation
then fulfill the promise
*/
function resetRound(aniSettings) {
	"use strict";

	//    var pointData = aniSettings.datapoints[aniSettings.currentRound];

	return new Promise(function (resolve) {
		if (aniSettings.graphOpt.hideEquation) {
			resolve(aniSettings);
		} else {
			$(equPara)
				.css("animation", `textDisappear ${aniDuration*0.15}s ease-in-out`)
				.one("animationend", function (e) {
					$(equPara).css("opacity", 0);
					katex.render(`${profOpt.equation}`, equPara);
					resolve(aniSettings);
				});
		}
	});
}

/*
Return to default beginning equation for the next animation or for the end
*/
function showDefaultEqu(aniSettings) {
	return new Promise(function (resolve) {
		if (aniSettings.graphOpt.hideEquation) {
			resolve(aniSettings);
		} else {
			$(equPara)
				.css("animation", `textAppear ${aniDuration*0.15}s ease-in-out`)
				.one("animationend", function (e) {
					$(equPara).css("opacity", 1);
					resolve(aniSettings);
				});
		}
	});
}

/*
Accept the datapoint and its iterator and plot that point being passed through
*/
function plotter(aniSettings) {
	"use strict";
	return new Promise(function (resolve) {
		plotGraph.update(aniSettings, function () {
			resolve(aniSettings);
		});
	});
}

/*
This function acts as an iterator so that the promise chain knows which
datapoint to handle and to animate
*/
function updateRound(aniSettings) {
	"use strict";

	var placeholder = aniSettings.datapoints[aniSettings.currentRound];

	return new Promise(function (resolve) {
		aniSettings.currentRound += 1;
		placeholder.updatePoint = false;

		resolve(aniSettings);
	});
};

/*
Two functions in order to replace the function machine gif with the animated
gif and backwards.
*/
function animateFuncMachine(aniSettings) {
	return new Promise(function (resolve) {
		$("#functionMachine").css({
			"background-image": "url(./img/functionMachineAni.gif)"
		})
		resolve(aniSettings)
	});
}

function stopAniFuncMachine(aniSettings) {
	return new Promise(function (resolve) {
		$("#functionMachine").css({
			"background-image": "url(./img/functionMachineStill.gif)"
		})
		resolve(aniSettings)
	});
}

/*
A function to show the y answer leaving the function machine to
start the next animation of going back to the y column.
*/
function miniAni(aniSettings) {
	return new Promise(function (resolve) {

		var placeholder = aniSettings.datapoints[aniSettings.currentRound],
			yvalue = placeholder.y,
			para = $(`<p>${yvalue}</p>`);

		$(para).css({
			"fontSize": "20px"
		})

		$("body").append(para);

		para
			.css({
				position: "absolute",
				opacity: 0,
				left: 630,
				top: 160
			})
			.animate({
				opacity: 1,
				top: 200
			}, function (e) {
				para.css({
					display: "none"
				});
				resolve(aniSettings);
			});
	});
}

/*
A promise chain to run through the whole animation process

NOTE
A promise chain has been utiziled in order to easily plugin
extra functions that would be great to have in the animation
process.  A promise chain has also been used in order to wait
for a animation to end to start the next animation.
*/

/*
Default Promise Chain
*/
function aniPromiseChain(dps, chain) {

	dps.datapoints.forEach(function (datapoint) {
		if (datapoint.updatePoint === true) {
			chain = chain
				.then(runAnimation("xToMachine", datapoint.x))
				.then(animateFuncMachine)
				.then(statusMessage("Calculating"))
				.then(replaceXEqu)
				.then(showEvaluateEqu)
				.then(showYAns)
				.then(showEquationAgain)
				.then(stopAniFuncMachine)
				.then(statusMessage(""))
				.then(miniAni)
				.then(runAnimation("machineToY", datapoint.y))
				.then(placeYValue)
				.then(runAnimation("yToStatusBar", `(${datapoint.x},${datapoint.y})`))
				.then(statusMessage(`Plotting (${datapoint.x},${datapoint.y})`))
				.then(plotter)
				.then(statusMessage(``))
				.then(resetRound)
				.then(showDefaultEqu);
		}
		chain = chain.then(updateRound);
	});
}

/*
If the "Hide Animation" checkbox is checked then skip the whole animation
promise chain and just append the y values
*/
function animateHide(dps, chain) {

	dps.datapoints.forEach(function (datapoint) {
		if (datapoint.updatePoint === true) {
			chain = chain
				.then(placeYValue)
				.then(statusMessage(`Plotting (${datapoint.x},${datapoint.y})`))
				.then(plotter);
		}
		chain = chain.then(updateRound);
	});
}

/*
Handle all CSS animations by creating a Promise chain through a for loop.
*/
function animatorControl(dps) {
	"use strict";

	var numContainer = $("#numContainer"),
		chain = Promise.resolve(dps);

	numContainer.innerHTML = "";

	if (aniDuration === 0.5) {
		animateHide(dps, chain);
	} else {
		aniPromiseChain(dps, chain);
	}

}
