import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { gaugeChart } from './chart';

@Component({
    selector: 'app-guage-chart',
    templateUrl: './guage-chart.component.html',
    styleUrls: ['./guage-chart.component.scss']
})
export class GuageChartComponent implements OnInit, AfterViewInit {
    @Input() score: number;
    id: string;
    ngOnInit() {
        this.id = 'chart' + Math.ceil(Math.random() * 10000) + '-' + Math.ceil(Math.random() * 10000);
    }

    ngAfterViewInit() {
        this.drawChart();
    }

    drawChart() {
        let self = this;
        var gauge = gaugeChart(this.id);
        gauge.width(260);
        gauge.height(200);
        gauge.innerRadius(50);
        gauge.outerRadius(80);

        d3.select("#" + this.id).datum([this.score]).call(gauge);
        function resize() {
            var gWidth = Math.min((d3.select("#" + self.id).node() as any).offsetWidth, 260);
            gauge.width(gWidth)
            gauge.innerRadius(gWidth / 4 + 55);
            gauge.outerRadius((gWidth / 4) + 45);
            d3.select("#" + self.id).call(gauge);
        }
        resize();
        // setInterval(() => {
        //     d3.select("#chart").datum([Math.floor(Math.random() * 100)]).call(gauge);
        // }, 2000);
        // window.addEventListener("resize", resize);

        // var button = document.getElementById("random");
        // button.addEventListener("click", function () {
        //     d3.select("#chart").datum([50]).call(gauge);
        // });
    }
}
