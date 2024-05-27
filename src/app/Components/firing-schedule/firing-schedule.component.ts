import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FiringSchedule } from 'src/app/Models/FiringScheduleModel';
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

  public updateChart(chartData: any, schedule: FiringSchedule, totalTime: string) {
    const seriesName = 'Temperature over Time';
    this.options = {
      title: {
          text: `Total Time: ${totalTime} hours`,
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
            return `Time: ${time.toFixed(2)} hours<br/>Temperature: ${temp}°${schedule.tempScale}`;
        },
      },
      xAxis: {
          type: 'value',
          name: 'Time (minutes)',
      },
      yAxis: {
          type: 'value',
          name: schedule.tempScale === 'F' ? 'Temperature (°F)' : 'Temperature (°C)',
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
