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
        var gauge = gaugeChart(this.id);
        const size = 400;
        gauge.width(size);
        gauge.height(size * 0.5 + 5);
        gauge.innerRadius(size / 2 - 6);
        gauge.outerRadius(size / 2 - 16);
        d3.select("#" + this.id).datum([this.score]).call(gauge);
    }
}
