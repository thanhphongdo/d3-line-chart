import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
    ngOnInit() {
        this.drawChart();
    }

    drawChart() {
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const createGradient = select => {
            const gradient = select
                .select('defs')
                .append('linearGradient')
                .attr('id', 'gradient')
                .attr('x1', '100%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '0%');

            gradient
                .append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#6CBE45;stop-opacity:0.5');

            gradient
                .append('stop')
                .attr('offset', '50%')
                .attr('style', 'stop-color:#3084C6;stop-opacity:0.5');
            gradient
                .append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#FFFFFF;');
        }

        // append the svg object to the body of the page
        var svg = d3.select("#line-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        svg.append('defs');
        svg.call(createGradient)

        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv").then(data => {
            let chartData = data.map(item => {
                return {
                    date: d3.timeParse("%Y-%m-%d")(item.date),
                    value: item.value
                }
            }).slice(500, 600);
            var x = d3.scaleTime()
                .domain(d3.extent(chartData, d => d.date))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(chartData, (d) => { return +d.value; })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // // Add the line
            const line = d3.line()
                .x((d: any) => x(d.date))
                .y((d: any) => y(d.value))
                .curve(d3.curveCatmullRom.alpha(0.5));

            svg.append("path")
                .datum(chartData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line as any);
            svg.append("path")
                .datum(chartData.slice(0, chartData.length - 1))
                .attr("fill", "none")
                // .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                // .attr("d", line as any)
                .attr('d', (d, index) => {
                    const lineValues = line(d as any).slice(1);
                    const splitedValues = lineValues.split(',');

                    return `M0,${height},${lineValues},l0,${height - (splitedValues as any)[splitedValues.length - 1]}`
                })
                .style('fill', 'url(#gradient)')
        })

        //Read the data
        // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

        //     // When reading the csv, I must format variables:
        //     function (d) {
        //         return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
        //     },

        //     // Now I can use this dataset:
        //     function (data) {

        //         // Add X axis --> it is a date format
        //         var x = d3.scaleTime()
        //             .domain(d3.extent(data, function (d) { return d.date; }))
        //             .range([0, width]);
        //         svg.append("g")
        //             .attr("transform", "translate(0," + height + ")")
        //             .call(d3.axisBottom(x));

        //         // Add Y axis
        //         var y = d3.scaleLinear()
        //             .domain([0, d3.max(data, function (d) { return +d.value; })])
        //             .range([height, 0]);
        //         svg.append("g")
        //             .call(d3.axisLeft(y));

        //         // Add the line
        //         svg.append("path")
        //             .datum(data)
        //             .attr("fill", "none")
        //             .attr("stroke", "steelblue")
        //             .attr("stroke-width", 1.5)
        //             .attr("d", d3.line()
        //                 .x(function (d) { return x(d.date) })
        //                 .y(function (d) { return y(d.value) })
        //             )

        //     })
    }
}
