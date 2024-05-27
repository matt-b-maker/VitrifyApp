import { Component, Input, OnInit } from '@angular/core';
import { Color, EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FiringSchedule } from 'src/app/Models/firingScheduleModel';
import { FiringScheduleService } from 'src/app/Services/firing-schedule.service';

@Component({
  selector: 'app-firing-schedule',
  standalone: true,
  templateUrl: './firing-schedule.component.html',
  styleUrls: ['./firing-schedule.component.scss'],
  imports: [NgxEchartsModule],
})
export class FiringScheduleComponent implements OnInit {
  @Input() options!: EChartsOption;
  @Input() data: any;
  @Input() schedule!: FiringSchedule;
  @Input() totalTime!: string;

  chartHeightStyle: string = `height: ${window.innerWidth * 0.7}px;`;

  constructor() {}

  ngOnInit() {
    this.updateChart(this.data, this.schedule, this.totalTime);
  }

  public updateChart(
    chartData: any,
    schedule: FiringSchedule,
    totalTime: string
  ) {
    console.log(chartData);
    const seriesName = 'Temperature over Time';
    this.options = {
      title: {
        text: `Total Time: ${totalTime} hrs`,
      },
      // legend: {
      //     data: [seriesName],
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        formatter: (params: any) => {
          let time = params[0].data[0];
          let temp = params[0].data[1];
          return `Time: ${time.toFixed(2)} hours<br/>Temperature: ${temp}°${
            schedule.tempScale
          }`;
        },
      },
      xAxis: {
        type: 'value',
        // name: 'Time (minutes)',
        // axisLabel: {
        //   inside: false,  // Place labels inside the axis
        //   rotate: 10,     // Rotate labels
        //   margin: 10,     // Margin between the labels and the axis
        //   formatter: '{value} min',  // Add units to labels
        // },
        // nameLocation: 'middle',
        // nameGap: 30,
      },
      yAxis: {
        type: 'value',
        // name:
        //   schedule.tempScale === 'F' ? 'Temperature (°F)' : 'Temperature (°C)',
        // nameLocation: 'middle',
        // nameGap: 40,
        // axisLabel: {
        //   formatter: '{value}°',
        // },
        // nameRotate: 90,
      },
      series: [
        {
          name: seriesName,
          type: 'line',
          data: chartData,
          smooth: true,
        },
      ],
    };
  }
}
