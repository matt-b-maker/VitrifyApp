import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FiringScheduleService } from 'src/app/Services/firing-schedule.service';
import { EChartsOption } from 'echarts';
import { AnimationService } from 'src/app/Services/animation.service';
import { FiringDetailsService } from 'src/app/Services/firing-details.service';
import { Segment } from 'src/app/Models/segment';
import { FiringSchedule } from 'src/app/Models/FiringScheduleModel';
import { FiringScheduleComponent } from 'src/app/Components/firing-schedule/firing-schedule.component';
import { AlertController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-firing-schedule-builder',
  templateUrl: './firing-schedule-builder.page.html',
  styleUrls: ['./firing-schedule-builder.page.scss'],
})
export class FiringScheduleBuilderPage {
  @ViewChild(FiringScheduleComponent)
  firingScheduleComponent!: FiringScheduleComponent;
  @ViewChild('ionItemsContainer') private myScrollContainer!: ElementRef;

  hourInputs: number[] = [];
  minuteInputs: number[] = [];
  durationInputs: string[] = [];

  hourOptions: number[] = Array.from({ length: 25 }, (_, k) => k);
  minuteOptions: number[] = Array.from({ length: 61 }, (_, k) => k);

  coneOptions: string[] = this.firingDetailsService.firingCones;
  selectedCone: string = '6';

  chartHeightStyle: string = `height: ${window.innerWidth * 0.7}px;`;
  chartData: any = this.transformFiringSchedule(
    this.firingScheduleService.firingScheduleBuildInProgress
  );

  addSegmentDisabled: boolean = false;

  options!: EChartsOption;

  constructor(
    public firingScheduleService: FiringScheduleService,
    private firingDetailsService: FiringDetailsService,
    private animationService: AnimationService,
    private alertController: AlertController
  ) {
    this.hourInputs =
      this.firingScheduleService.firingScheduleBuildInProgress.segments.map(
        (segment) => {
          if (segment.duration.split(':')[0] === '00') return 0;
          return parseInt(segment.duration.split(':')[0]);
        }
      );
    this.minuteInputs =
      this.firingScheduleService.firingScheduleBuildInProgress.segments.map(
        (segment) => {
          if (segment.duration.split(':')[0] === '00') return 0;
          return parseInt(segment.duration.split(':')[1]);
        }
      );
    this.durationInputs =
      this.firingScheduleService.firingScheduleBuildInProgress.segments.map(
        (segment) => {
          return segment.duration;
        }
      );
  }

  async addSegment() {
    this.addSegmentDisabled = true;
    if (
      this.firingScheduleService.firingScheduleBuildInProgress.segments
        .length >= 1
    ) {
      let lastSegmentIndex =
        this.firingScheduleService.firingScheduleBuildInProgress.segments
          .length - 1;
      if (
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          lastSegmentIndex
        ].hold
      ) {
        this.firingScheduleService.firingScheduleBuildInProgress.segments.push({
          lowTemp:
            this.firingScheduleService.firingScheduleBuildInProgress.segments[
              lastSegmentIndex
            ].lowTemp,
          highTemp:
            this.firingScheduleService.firingScheduleBuildInProgress.segments[
              lastSegmentIndex
            ].lowTemp + 100,
          duration: '01:00',
          hold: false,
        });
      } else {
        //set up the new segment and check for max temp reached
        let newSegment = {
          lowTemp:
            this.firingScheduleService.firingScheduleBuildInProgress.segments[
              lastSegmentIndex
            ].highTemp,
          highTemp:
            this.firingScheduleService.firingScheduleBuildInProgress.segments[
              lastSegmentIndex
            ].highTemp + 100,
          duration: '01:00',
          hold: false,
        };
        if (
          newSegment.lowTemp ===
          this.firingScheduleService.firingScheduleBuildInProgress.maxTemp
        ) {
          await this.alertController
            .create({
              header: 'Max Temperature Reached',
              message:
                'You have reached the maximum temperature for this firing schedule.',
              buttons: ['OK'],
            })
            .then((alert) => alert.present());
          return;
        } else if (
          newSegment.highTemp >
          this.firingScheduleService.firingScheduleBuildInProgress.maxTemp
        ) {
          newSegment.highTemp =
            this.firingScheduleService.firingScheduleBuildInProgress.maxTemp;
        }
        this.firingScheduleService.firingScheduleBuildInProgress.segments.push(
          newSegment
        );
      }
      this.hourInputs.push(1);
      this.minuteInputs.push(0);
      this.durationInputs.push('01:00');

      // let segments = document.querySelectorAll('.segment');
      // let lastSegment = segments[segments.length - 1] as HTMLElement;
      // lastSegment?.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      // });

      await this.scrollToBottom();

      this.updateChildChart();

      await new Promise(resolve => setTimeout(resolve, 500));

      this.addSegmentDisabled = false;

      return;
    }
    this.firingScheduleService.firingScheduleBuildInProgress.segments.push({
      lowTemp: 70,
      highTemp: 200,
      duration: '01:00',
      hold: false,
    });
    this.hourInputs.push(1);
    this.minuteInputs.push(0);
    this.durationInputs.push('01:00');

    // let segments = document.querySelectorAll('.segment');
    // let lastSegment = segments[segments.length - 1] as HTMLElement;
    // lastSegment?.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'center',
    // });

    //do the animation
    await this.animationService.slideInNewItem().then(() => {
      // Get the last ingredient's HTML element and slide it in
      let materialElements = document.querySelectorAll('.segment');
      let lastIngredientElement = materialElements[
        materialElements.length - 1
      ] as HTMLElement;
      lastIngredientElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    this.updateChildChart();

    this.addSegmentDisabled = false;
  }

  async scrollToBottom(): Promise<void> {
    setTimeout(() => {
      let segments = document.querySelectorAll('.segment');
      let lastSegment = segments[segments.length - 1] as HTMLElement;
      lastSegment?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 300);
  }

  async removeSegment(index: number) {
    let segments = document.querySelectorAll('.segment');
    let segmentToRemove = segments[index] as HTMLElement;

    await this.animationService.slideOutItem(segmentToRemove).then(() => {
      //remove the segment from the firing schedule and every one after it
      this.firingScheduleService.firingScheduleBuildInProgress.segments.splice(
        index,
        1
      );
      this.hourInputs.splice(index, 1);
      this.minuteInputs.splice(index, 1);
      this.durationInputs.splice(index, 1);

      // Slide up all remaining ingredients to fill the gap
      this.animationService.slideUpRemainingItems(
        Array.from(segments) as HTMLElement[],
        index
      );
    });
    this.updateChildChart();
  }

  setHoldForSegment(event: any, segment: Segment) {
    segment.hold = event.detail.checked;
    this.updateChildChart();
  }

  setSegmentDuration(event: any, type: string, index: number) {
    if (type === 'hour') {
      this.hourInputs[index] = event.detail.value;
    } else if (type === 'minute') {
      this.minuteInputs[index] = event.detail.value;
    }
    this.durationInputs[index] = `${this.hourInputs[index]
      .toString()
      .padStart(2, '0')}:${this.minuteInputs[index]
      .toString()
      .padStart(2, '0')}`;
    this.firingScheduleService.firingScheduleBuildInProgress.segments[
      index
    ].duration = this.durationInputs[index];
    this.updateChildChart();
  }

  adjustTempScale(event: any) {
    let previousTempScale =
      this.firingScheduleService.firingScheduleBuildInProgress.tempScale;
    this.firingScheduleService.firingScheduleBuildInProgress.tempScale =
      event.detail.value;
    if (
      previousTempScale === 'F' &&
      this.firingScheduleService.firingScheduleBuildInProgress.tempScale === 'C'
    ) {
      this.firingScheduleService.firingScheduleBuildInProgress.maxTemp =
        Math.round(
          ((this.firingScheduleService.firingScheduleBuildInProgress.maxTemp -
            32) *
            5) /
            9
        );
      this.firingScheduleService.firingScheduleBuildInProgress.segments.forEach(
        (segment) => {
          segment.lowTemp =
            segment.lowTemp === 0
              ? 0
              : Math.round(((segment.lowTemp - 32) * 5) / 9);
          segment.highTemp = Math.round(((segment.highTemp - 32) * 5) / 9);
        }
      );
    } else if (
      previousTempScale === 'C' &&
      this.firingScheduleService.firingScheduleBuildInProgress.tempScale === 'F'
    ) {
      this.firingScheduleService.firingScheduleBuildInProgress.maxTemp =
        Math.round(
          (this.firingScheduleService.firingScheduleBuildInProgress.maxTemp *
            9) /
            5 +
            32
        );
      this.firingScheduleService.firingScheduleBuildInProgress.segments.forEach(
        (segment) => {
          segment.lowTemp =
            segment.lowTemp === 0
              ? 0
              : Math.round((segment.lowTemp * 9) / 5 + 32);
          segment.highTemp = Math.round((segment.highTemp * 9) / 5 + 32);
        }
      );
    }
    this.updateChildChart();
  }

  updateChildChart() {
    this.chartData = this.transformFiringSchedule(
      this.firingScheduleService.firingScheduleBuildInProgress
    );
    this.firingScheduleComponent.updateChart(
      this.chartData,
      this.firingScheduleService.firingScheduleBuildInProgress,
      this.getTotalTime()
    );
  }

  transformFiringSchedule(schedule: FiringSchedule) {
    let time: number = 0;
    let data = [] as [number, number][]; // Array of [time, temperature] pairs

    schedule.segments.forEach((segment) => {
      let durationMinutes =
        parseInt(segment.duration.split(':')[0]) * 60 +
        parseInt(segment.duration.split(':')[1]);

      // If the segment is the first one
      if (schedule.segments.indexOf(segment) === 0) {
        data.push([time / 60, segment.lowTemp]); // Convert minutes to hours
        time += durationMinutes;
        data.push([
          time / 60,
          segment.hold ? segment.lowTemp : segment.highTemp,
        ]); // Convert minutes to hours
        return;
      }

      // If the segment is not the first one
      time += durationMinutes;
      data.push([time / 60, segment.hold ? segment.lowTemp : segment.highTemp]); // Convert minutes to hours
    });

    return data;
  }

  getTotalTime() {
    let totalMinutes =
      this.firingScheduleService.firingScheduleBuildInProgress.segments.reduce(
        (acc, segment) => {
          return (
            acc +
            parseInt(segment.duration.split(':')[0]) * 60 +
            parseInt(segment.duration.split(':')[1])
          );
        },
        0
      );
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }
}
