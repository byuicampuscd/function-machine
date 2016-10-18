$(document).ready(function () {

	/*
	Load Query substring
	*/
	var queryString = location.search.substring(1),
		query = queryString.split("=")[1] + ".json";

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

				document.querySelector(".graph").firstChild.style.display = "none";

				/*Checkbox onclick event*/
				$("input#showGraph[type='checkbox']").click(e => {
					var checked = e.target.checked;
					if (checked) {
						document.querySelector(".graph").firstChild.style.display = "block";
					} else {
						document.querySelector(".graph").firstChild.style.display = "none";
					}
				})

				changePlot(profOpt.equation);
			}
		});

	}).fail(function () {
		$("#status p").append("Add a query string")
	});;

});
