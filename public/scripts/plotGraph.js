/*jslint plusplus: true, browser: true, devel: true*/
/*global d3, functionPlot*/
var plotGraph = (function () {
    "use strict";
    var graphLocationSelector,
        dotLocation,
        currentEquation,
        funPlot,
        xScale,
        yScale,
        freeId = 0;

    //these two functions make the factory function that is used in the animations for the point labels
    function updateTextX(currentPoint) {
        return function (d) {
            var zero = (0).toFixed(2);

            return function (t) {
                var location = currentPoint.x * t;
                this.textContent = "( " + location.toFixed(2) + ", " + zero + ")";
            };
        };
    }

    function updateTextY(currentPoint) {
        return function () {

            var xRounded = currentPoint.x,
                yVal = currentPoint.y;

            return function (t) {
                this.textContent = "( " + xRounded + ", " + (yVal * t).toFixed(2) + ")";
            };
        };
    }

    function makePointId(numIn) {
        return 'graphPoint' + numIn;
    }

    function makePointGroup(currentPoint) {
        var pointGroup = d3.selectAll(dotLocation).append('g')
            .attr('class', 'point')
            .attr('id', makePointId(currentPoint.id));

        //add the circle
        pointGroup.append('circle')
            .attr('r', 4)
            .attr('cx', 0)
            .attr('cy', 0);

        //add the label
        pointGroup.append('text')
            .text('(0, 0)')
            .attr('x', 5)
            .attr('y', 15);
        //move it to (0,0)
        pointGroup.attr('transform', 'translate(' + xScale(0) + ' ' + yScale(0) + ')');
        return pointGroup;
    }

    function update(aniOptions, callback) {
        var currentPoint = aniOptions.datapoints[aniOptions.currentRound],
            lineIsPlotted = document.querySelectorAll(dotLocation + ' .graph .line').length > 0,
            pointGroup,
            transition;

        //clear any points that will get updated
        aniOptions.datapoints.forEach(function (point) {
            if (point.updatePoint) {
                d3.select('#' + makePointId(point.id)).remove();
            }
        });

        //check if we need to hide or show the plotline
        if (aniOptions.graphOpt.graphHide) {
            d3.select(dotLocation + ' .graph .line').attr('display', 'none');
        } else {
            d3.select(dotLocation + ' .graph .line').attr('display', 'inline');
        }

        //does the currentRound need to be updateded?
        if (!currentPoint.updatePoint) {
            //nothitng to see here just keep on moving
            callback(aniOptions);
        } else {
            //draw point
            pointGroup = makePointGroup(currentPoint);

            //is animation on?
            if (aniOptions.graphOpt.animateHide) {
                //move it into place without animation
                pointGroup.attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(currentPoint.y) + ')');
                //update the lable
                pointGroup.select('text').text('(' + currentPoint.x + ', ' + currentPoint.y + ')');
                //call callback
                callback(aniOptions);

            } else {
                //draw point with animaion
                //First transition - move the group in the X
                transition = pointGroup
                    .transition()
                    .duration(1500)
                    .ease('cubic-out')
                    .attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(0) + ')');
                //sub transition - update the label
                transition.select('text').tween('text', updateTextX(currentPoint));

                //Second transition - move the group in the Y
                //sub transition - update the label
                transition.transition()
                    .duration(1500)
                    .ease('cubic-out')
                    .attr('transform', 'translate(' + xScale(currentPoint.x) + ' ' + yScale(currentPoint.y) + ')')
                    .each('end', function () {
                        callback(aniOptions);
                    })
                    .select('text').tween('text', updateTextY(currentPoint));
            }
        }
    }

    function setup(aniOptions, selector) {
        //sugar
        var optsIn = aniOptions.graphOpt,
            graphOptions = {
                target: selector,
                data: [{
                    fn: optsIn.equation,
                    skipTip: true
                }],
                xAxis: {
                    domain: [optsIn.view.x.min, optsIn.view.x.max]
                },
                yAxis: {
                    domain: [optsIn.view.y.min, optsIn.view.y.max]
                },
                disableZoom: true,
                grid: true,
				annotations: [{
					x: 0,
					text: 'y axis'
				}, {
					y: 0,
					text: 'x axis'
				}]
            };

        //save some things for later
        graphLocationSelector = selector;
        dotLocation = graphLocationSelector + ' .content';
        currentEquation = optsIn.equation;

        //make the plot and scales
        funPlot = functionPlot(graphOptions);
        xScale = funPlot.meta.xScale;
        yScale = funPlot.meta.yScale;

        //clean out any old points first
        d3.selectAll(dotLocation + ' .point').remove();
    }

    return {
        update: update,
        setup: setup
    };
}());
