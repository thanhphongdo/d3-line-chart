import * as d3 from 'd3';
(window as any).d3 = d3;

function gaugeChart(chartId: string) {
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 450,
        height = 450,
        arcMin = -Math.PI / 2,
        arcMax = Math.PI / 2,
        innerRadius = 60,
        outerRadius = 80,
        dataDomain = [0, 50, 100],
        labelPad = 10,
        dataValue = function (d) { return +d; },
        colorScale = d3.scaleLinear(),
        arcScale = d3.scaleLinear(),
        colorOptions: any = ["#d7191c", "#efef5d", "#1a9641"],
        arc = d3.arc();

    var getColor = d3.scaleLinear()
        .domain([0, 20, 40, 60, 80, 100])
        .range(['rgb(206,56,46)', 'rgb(223,126,50)', 'rgb(228,191,69)', 'rgb(191,223,115)', 'rgb(160,214,121)', 'rgb(129,188,88)'] as any);

    function createGradient(select, score) {
        const gradient = select
            .select('defs')
            .append('linearGradient')
            .attr('id', `guage-gradient-${chartId}`)
            .attr('x1', '100%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '0%');

        gradient
            .append('stop')
            .attr('offset', '0%')
            .attr('style', 'stop-color:' + getColor(score));
        gradient
            .append('stop')
            .attr('offset', '20%')
            .attr('style', 'stop-color:' + getColor((1 - 0.2) * score));
        gradient
            .append('stop')
            .attr('offset', '40%')
            .attr('style', 'stop-color:' + getColor((1 - 0.4) * score));
        gradient
            .append('stop')
            .attr('offset', '60%')
            .attr('style', 'stop-color:' + getColor((1 - 0.6) * score));
        gradient
            .append('stop')
            .attr('offset', '80%')
            .attr('style', 'stop-color:' + getColor((1 - 0.8) * score));
        gradient
            .append('stop')
            .attr('offset', '100%')
            .attr('style', 'stop-color:' + getColor(0));
    }

    function chart(selection) {
        selection.each(function (data) {
            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            data = data.map(function (d, i) { return dataValue(d); });
            arcScale = d3.scaleLinear().domain(dataDomain).range([arcMin, 0, arcMax]);
            colorScale = d3.scaleLinear().domain(dataDomain).range(colorOptions);
            arc = d3.arc().innerRadius(innerRadius)
                .outerRadius(outerRadius)
                .startAngle(arcMin);

            // Select the svg element, if it exists.
            var svgSeleted = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svgSeleted.enter().append("svg").append("g");
            var arcGEnter = gEnter.append("g").attr("class", "arc");
            arcGEnter.append("path").attr("class", "bg-arc");
            arcGEnter.append("path").attr("class", "data-arc")
                .datum({ endAngle: arcMin, startAngle: arcMin, score: dataDomain[0] })
                .attr("d", arc as any)
                .style("fill", colorScale(dataDomain[0]))
                .each(function (d) { (this as any)._current = d; });
            arcGEnter.append("text").attr("class", "arc-label");

            var ticks = [
                {
                    score: 0
                },
                {
                    score: 25
                },
                {
                    score: 50
                },
                {
                    score: 75
                },
                {
                    score: 100
                }
            ]
            arcGEnter.selectAll(".lines").data(ticks).enter()
                .append("path")
                .attr("class", (d) => {
                    return "lines";
                });
            arcGEnter.selectAll(".ticks").data(data)
                .enter().append("circle")
                .attr("class", "ticks");

            // Update the outer dimensions.
            var svg = selection.select(`#${chartId} svg`);
            svg.append('defs');
            svg.call(createGradient, data[0]);
            svg.attr("width", width).attr("height", height);
            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var arcG = svg.select("g.arc")
                .attr("transform", "translate(" +
                    ((width - margin.left - margin.right) / 2) + "," +
                    (height - 5 + ")"));

            svg.select("g.arc .bg-arc")
                .datum({ endAngle: arcMax })
                .style("fill", "#ddd")
                .attr("d", arc);

            // https://bl.ocks.org/mbostock/1346410
            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
                };
            }

            var dataArc = svg.select("g.arc .data-arc")
                .datum({ score: data[0], startAngle: arcMin, endAngle: arcScale(data[0]) })
                .transition()
                .duration(0)
                .style('fill', `url(#guage-gradient-${chartId})`)
                .style("opacity", function (d) { return d.score < dataDomain[0] ? 0 : 1; })
                .attrTween("d", arcTween);

            var arcBox = svg.select("g.arc .bg-arc").node().getBBox();
            svg.select("text.arc-label")
                .datum({ score: data[0] })
                .attr("x", (arcBox.width / 2) + arcBox.x)
                .attr("y", -15)
                .style("alignment-baseline", "central")
                .style("text-anchor", "middle")
                .style("font-size", "30px")
                .text(function (d) { return d3.format(".1f")(d.score); });

            var markerLine = d3.radialLine()
                .angle(function (d) { return arcScale(d as any); })
                .radius(function (d, i) {
                    return innerRadius + ((i % 2) * ((outerRadius - innerRadius)));
                });

            arcG.selectAll(".lines")
                .attr("d", function (d) {
                    return markerLine([d.score, d.score]);
                })
                .style("fill", "none")
                .style("stroke-width", 2)
                .style("stroke", "#fff");
            arcG.selectAll(".ticks")
                .attr("r", 10)
                .attr('fill', 'rgba(255,255,255,1)')
                .attr('stroke', getColor(data[0]))
                .style("stroke-width", 2)
                .attr("cx", function (d) {
                    return Math.cos(arcScale(d) + arcMin) * ((outerRadius - 5) + labelPad);
                })
                .attr("cy", function (d) {
                    var yVal = Math.sin(arcScale(d) + arcMin) * (outerRadius - 5 + labelPad);
                    return yVal < -1 ? yVal : -7;
                }).text(function (d) { return d; });
        });
    }

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.innerRadius = function (_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
        return chart;
    };

    chart.outerRadius = function (_) {
        if (!arguments.length) return outerRadius;
        outerRadius = _;
        return chart;
    };

    chart.dataDomain = function (_) {
        if (!arguments.length) return dataDomain;
        dataDomain = _;
        return chart;
    };

    chart.colorOptions = function (_) {
        if (!arguments.length) return colorOptions;
        colorOptions = _;
        return chart;
    };

    chart.labelPad = function (_) {
        if (!arguments.length) return labelPad;
        labelPad = _;
        return chart;
    };

    return chart;
}

export {
    gaugeChart
}