import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { gaugeChart } from './chart';

@Component({
    selector: 'app-guage-chart',
    templateUrl: './guage-chart.component.html',
    styleUrls: ['./guage-chart.component.scss']
})
export class GuageChartComponent implements OnInit {
    ngOnInit() {
        this.drawChart();
    }

    drawChart() {
        var gauge = gaugeChart();
        gauge.width(260);
        gauge.height(200);
        gauge.innerRadius(50);
        gauge.outerRadius(80);

        d3.select("#chart").datum([65]).call(gauge);

        function resize() {
            var gWidth = Math.min((d3.select("#chart").node() as any).offsetWidth, 260);
            gauge.width(gWidth)
            gauge.innerRadius(gWidth / 4 + 40);
            gauge.outerRadius((gWidth / 4) + 30);
            d3.select("#chart").call(gauge);
        }

        resize();
        // window.addEventListener("resize", resize);

        // var button = document.getElementById("random");
        // button.addEventListener("click", function () {
        //     d3.select("#chart").datum([50]).call(gauge);
        // });
    }
}
