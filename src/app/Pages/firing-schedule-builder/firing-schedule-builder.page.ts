import { Component, OnInit } from '@angular/core';
import { FiringScheduleService } from 'src/app/Services/firing-schedule.service';
import { EChartsOption } from 'echarts';
import { AnimationService } from 'src/app/Services/animation.service';

@Component({
  selector: 'app-firing-schedule-builder',
  templateUrl: './firing-schedule-builder.page.html',
  styleUrls: ['./firing-schedule-builder.page.scss'],
})
export class FiringScheduleBuilderPage {
  hourInputs: number[] = [];
  minuteInputs: number[] = [];
  durationInputs: string[] = [];

  hourOptions: number[] = Array.from({length: 25}, (_, k) => k);
  minuteOptions: number[] = Array.from({length: 60}, (_, k) => k + 1);

  chartHeightStyle: string = `height: ${window.innerWidth * .7}px;`;

  options!: EChartsOption;

  constructor(public firingScheduleService: FiringScheduleService, private animationService: AnimationService) {
    this.hourInputs = this.firingScheduleService.firingScheduleBuildInProgress.segments.map(segment => {
      if (segment.duration.split(':')[0] === '00') return 0;
      return parseInt(segment.duration.split(':')[0]);
    });
    this.minuteInputs = this.firingScheduleService.firingScheduleBuildInProgress.segments.map(segment => {
      return parseInt(segment.duration.split(':')[1]);
    });
    this.durationInputs = this.firingScheduleService.firingScheduleBuildInProgress.segments.map(segment => {
      return segment.duration;
    });
  }

  async addSegment() {
    if (this.firingScheduleService.firingScheduleBuildInProgress.segments.length >= 1) {
      let lastSegmentIndex = this.firingScheduleService.firingScheduleBuildInProgress.segments.length - 1;
      this.firingScheduleService.firingScheduleBuildInProgress.segments.push({lowTemp: this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].highTemp, highTemp: 0, duration: '00:01'});
      return;
    }
    this.firingScheduleService.firingScheduleBuildInProgress.segments.push({lowTemp: 0, highTemp: 0, duration: '00:01'});
    this.hourInputs.push(0);
    this.minuteInputs.push(1);
    this.durationInputs.push('00:01');

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
  }

  async removeSegment(index: number) {

    let segments = document.querySelectorAll('.segment');
    let segmentToRemove = segments[index] as HTMLElement;

    await this.animationService.slideOutItem(segmentToRemove).then(() => {
      this.firingScheduleService.firingScheduleBuildInProgress.segments.splice(index, 1);
      this.hourInputs.splice(index, 1);
      this.minuteInputs.splice(index, 1);
      this.durationInputs.splice(index, 1);

      // Slide up all remaining ingredients to fill the gap
      this.animationService.slideUpRemainingItems(
        Array.from(segments) as HTMLElement[],
        index
      );
    });
  }

  setSegmentDuration(event: any, type: string, index: number) {
    if (type === 'hour') {
      this.hourInputs[index] = event.detail.value;
    } else if (type === 'minute') {
      this.minuteInputs[index] = event.detail.value;
    }
    this.durationInputs[index] = `${this.hourInputs[index].toString().padStart(2, '0')}:${this.minuteInputs[index].toString().padStart(2, '0')}`;
    this.firingScheduleService.firingScheduleBuildInProgress.segments[index].duration = this.durationInputs[index];
    console.log(this.firingScheduleService.firingScheduleBuildInProgress.segments);
  }
}
