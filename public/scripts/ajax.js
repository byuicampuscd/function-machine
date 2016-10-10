$(document).ready(function () {

	/*
	Load Query substring
	*/
	var queryString = location.search.substring(1),
		query = queryString.split("=")[1] + ".json";

	function showLineGraph() {
		if ($("input#showGraph[type='checkbox']").attr("checked") === "checked") {
			var graph = document.querySelector(".graph");
			while (graph.firstChild) {
				graph.removeChild(graph.firstChild)
			}
		}
	}

	function showProfOptions(profOpt, init) {
		/*
		Append the professor's chosen equations to the application
		*/

		var stringifiedData = JSON.stringify(init),
			opt = $("<option></option>").append(profOpt.name);

		$(opt)
			.val(profOpt.equation)
			.attr("data-profOpt", stringifiedData);

		$("select")
			.append(opt);
	}

	/*
	Load the professor configuration file
	*/

	$.getJSON(query, function (result) {

		window.professorConfigFile = result;

		$.each(result, function (i, profOpt) {

			var init = {
				graphOpt: profOpt
			};

			showProfOptions(profOpt, init);

			/*
			Display the default equation to the function machine
			*/
			if (i === 0) {
				//in events.js
				plotGraph.setup(init, "#graph");

				showLineGraph();

				/*Checkbox onclick event*/
				$("input#showGraph[type='checkbox']").click(e => {
					var checked = e.target.checked
					if (checked) {
						showLineGraph();
					} else {
						plotGraph.setup(init, "#graph");
					}
				})

				changePlot(profOpt.equation);
			}
		});

	}).fail(function () {
		$("#status p").append("Add a query string")
	});;

});
