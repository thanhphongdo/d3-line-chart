import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'd3-tutorial';

  ngOnInit() {
    const lineChartData = [
      {
        currency: "USD",
        values: [
          {
            date: "2018/01/01",
            close: 230
          },
          {
            date: "2018/02/01",
            close: 269
          },
          {
            date: "2018/03/01",
            close: 234
          },
          {
            date: "2018/04/01",
            close: 282
          },
          {
            date: "2018/05/01",
            close: 231
          },
          {
            date: "2018/06/01",
            close: 240
          },
          {
            date: "2018/07/01",
            close: 213
          },
          {
            date: "2018/08/01",
            close: 320
          },
          {
            date: "2018/09/01",
            close: 253
          },
          {
            date: "2018/10/01",
            close: 264
          },
          {
            date: "2018/11/01",
            close: 272
          },
          {
            date: "2018/12/01",
            close: 350
          }
        ]
      }
    ];

    const margin = {
      top: 20,
      bottom: 20,
      left: 50,
      right: 20
    };

    const width = 700 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

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

    const createGlowFilter = select => {
      const filter = select
        .select('defs')
        .append('filter')
        .attr('id', 'glow')

      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');

      const femerge = filter
        .append('feMerge');

      femerge
        .append('feMergeNode')
        .attr('in', 'coloredBlur');
      femerge
        .append('feMergeNode')
        .attr('in', 'SourceGraphic');
    }

    const svg = d3.select('#line-chart')
      .append('svg')
      .attr('width', 700 + margin.left + margin.right)
      .attr('height', 300 + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.append('defs');
    svg.call(createGradient);
    svg.call(createGlowFilter);

    const parseTime = d3.timeParse('%Y/%m/%d');

    const parsedData = lineChartData.map((company: any) => ({
      ticker: company.ticker,
      values: company.values.map(val => ({
        close: val.close,
        date: parseTime(val.date)
      }))
    }));

    console.log(parsedData);

    const xScale = d3.scaleTime()
      .domain([
        d3.min(parsedData, d => d3.min(d.values, (v: any) => v.date)) as any,
        d3.max(parsedData, d => d3.max(d.values, (v: any) => v.date)) as any
      ])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(parsedData, d => d3.min(d.values, (v: any) => v.close)) as any,
        d3.max(parsedData, d => d3.max(d.values, (v: any) => v.close)) as any
      ])
      .range([height - 20, 60]);

    const line = d3.line()
      .x((d: any) => xScale(d.date))
      .y((d: any) => yScale(d.close))
      .curve(d3.curveCatmullRom.alpha(0.5));

    svg.selectAll('.line')
      .data(parsedData)
      .enter()
      .append('path')
      .attr('d', d => {
        console.log(d);
        const lineValues = line(d.values).slice(1);
        const splitedValues = lineValues.split(',');

        return `M0,${height},${lineValues},l0,${height - (splitedValues as any)[splitedValues.length - 1]}`
      })
      .style('fill', 'url(#gradient)')

    svg.selectAll('.line')
      .data(parsedData)
      .enter()
      .append('path')
      .attr('d', d => {
        console.log(line(d.values));
        return line(d.values)
      })
      .attr('stroke-width', '2')
      .style('fill', 'none')
      .style('filter', 'url(#glow)')
      .attr('stroke', '#6CBE45');

    function setFade(selection, opacity) {
      selection.style('opacity', opacity);
    }

    const countValue = lineChartData[0].values.length;
    const tick = svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(countValue).tickFormat((d: any) => {
        return d3.timeFormat('%B')(d).slice(0, 3) + ' ' + d3.timeFormat('%Y')(d);
      }))
      .selectAll('.tick')
      .style('transition', '.2s');

    tick
      .selectAll('line')
      // .attr('stroke-dasharray', `5, 5`)
      .attr('stroke', '#D6E3EE')
      .attr('y2', `-${height}px`)

    tick
      .append('rect')
      .attr('width', `${(width / countValue) + 10}px`)
      .attr('x', `-${width / 24 + 5}px`)
      .attr('y', `-${height}px`)
      .attr('height', `${height + 30}px`)
      .style('cursor', 'pointer')
      .style('fill', 'transparent');

    const tickGroup = svg.selectAll('.tick')
      .append('g')
      .attr('transform', (x, i) => {
        return `translate(-20,${- height + yScale(parsedData[0].values[i].close) - 15})`
      })

    svg.selectAll('.tick')
      .append('image')
      .attr('href', (x, i) => {
        if (i == countValue - 1) {
          return '../assets/star.png';
        }
      })
      .attr('width', 30)
      .attr('height', 30)
      .attr('y', (x, i) => - height + yScale(parsedData[0].values[i].close) - 15)
      .attr('x', -15);
    tickGroup
      .append('rect')
      .attr('width', (x, i) => {
        if (i == countValue - 1) {
          return 50;
        }
      }).attr('height', (x, i) => {
        if (i == countValue - 1) {
          return 30;
        }
      })
      .attr('fill', '#6CBE45')
      .attr('y', -40)
      .attr('x', -5);

    tickGroup.append('polygon')
      .attr('points', '15,-10 20,-5 25,-10')
      .attr('fill', (x, i) => {
        if (i == countValue - 1) {
          return '#6CBE45';
        }
        return 'transparent';
      })

    tickGroup
      .append('text').text((x, i) => {
        if (i == countValue - 1) {
          return lineChartData[0].values[i].close;
        }
        return ''
      })
      .attr('fill', 'white')
      .attr('x', 20)
      .attr('y', -25)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '16')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')

    // tick
    //   .on('mouseout', function (data, index, elements) {
    //     d3.selectAll(elements)
    //       .call(setFade, 1);
    //   })
    //   .on('mouseover', function (data, index, elements) {
    //     d3.selectAll(elements)
    //       .filter(':not(:hover)')
    //       .call(setFade, 0.2);
    //   });

    svg.selectAll('.tick').selectAll('.tick > text').attr('data-text', function (text) {
      return d3.select(this).text();
    }).text('').append('tspan').attr('x', 0).attr('y', 10).text(function () {
      return d3.select(this.parentNode).attr('data-text').split(' ')[0];
    })
    svg.selectAll('.tick').selectAll('.tick > text').append('tspan').attr('x', 0).attr('y', 30).text(function () {
      return d3.select(this.parentNode).attr('data-text').split(' ')[1];
    });

    svg.select('.domain')
      .attr('stroke', '#ddd')
  }
}
