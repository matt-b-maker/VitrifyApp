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
import { FiringSchedule } from 'src/app/Models/firingScheduleModel';
import { FiringScheduleComponent } from 'src/app/Components/firing-schedule/firing-schedule.component';
import { AlertController, IonItemSliding, LoadingController, ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { AuthService } from 'src/app/Services/auth.service';

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

  chartData: any = this.firingScheduleService.transformFiringSchedule(
    this.firingScheduleService.firingScheduleBuildInProgress
  );

  addSegmentDisabled: boolean = false;

  options!: EChartsOption;

  chartContainerClass: string = 'chart-container fore';
  itemsContainerClass: string = 'ion-items-container rear';

  constructor(
    public firingScheduleService: FiringScheduleService,
    private firingDetailsService: FiringDetailsService,
    private animationService: AnimationService,
    private alertController: AlertController,
    private firestoreService: FirestoreService,
    private toast: ToastController,
    private loadingController: LoadingController,
    private auth: AuthService
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

  async openSegmentDialog() {
    this.addSegmentDisabled = true;
    await this.alertController.create({
      header: 'Add Segment',
      message: 'Which type of segment would you like to add?',
      buttons: [
        {
          text: 'Ramp',
          handler: () => {
            this.addSegment('ramp');
          }
        },
        {
          text: 'Hold',
          handler: () => {
            this.addSegment('hold');
          }
        },
        {
          text: 'Cool',
          handler: () => {
            this.addSegment('cool');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.addSegmentDisabled = false;
            console.log('Cancel clicked')
          }
        }
      ]
    }).then((alert) => alert.present());

    this.addSegmentDisabled = false;
  }

  async addSegment(type: string) {
    if (
      this.firingScheduleService.firingScheduleBuildInProgress.segments
        .length >= 1
    ) {
      let lastSegmentIndex =
        this.firingScheduleService.firingScheduleBuildInProgress.segments
          .length - 1;
      let previousType = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].type;
      let highTemp: number | string = 0;
      let lowTemp: number | string = 0;

      if (type === 'hold') {
        if (previousType === 'ramp') {
          lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].highTemp;
          highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].highTemp;
        } else if (previousType === 'hold' || previousType === 'cool') {
          lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].lowTemp;
          highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].lowTemp;
        }
        this.firingScheduleService.firingScheduleBuildInProgress.segments.push({
          lowTemp: lowTemp,
          highTemp: highTemp,
          duration: '01:00',
          hold: true,
          type: type,
        });
      } else if (type === 'ramp'){
        //set up the new segment and check for max temp reached
        if (previousType === 'cool' || previousType === 'hold') {
          lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].lowTemp;
          highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].lowTemp + 100;
        } else if (previousType === 'ramp') {
          lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].highTemp;
          highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].highTemp + 100;
        }
        let newSegment = new Segment(lowTemp, highTemp, '01:00', 'ramp')
        this.hourInputs.push(1);
        this.minuteInputs.push(0);
        this.durationInputs.push('01:00');
        await this.scrollToBottom();
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
      } else if (type === 'cool') {
        if (previousType === 'ramp') {
          lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].highTemp - 100;
          highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].highTemp;
        } else if (previousType === 'hold' || previousType === 'cool') {
          lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].lowTemp - 100;
          highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[lastSegmentIndex].lowTemp;
        }
        this.firingScheduleService.firingScheduleBuildInProgress.segments.push({
          lowTemp: lowTemp,
          highTemp: highTemp,
          duration: '01:00',
          hold: false,
          type: type,
        });
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
      type: 'ramp',
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

  setLowTemp(index: number) {

    //check for valid input
    if (this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp.toString().length > 4) {
      this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp = parseInt(this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp.toString().substring(0, 4));
    }
    if (this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp < 0) {
      this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp = 0;
    }
    if (this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp > this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp) {
      this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp - 1;
    }

    //check if there is a segment after this one
    if (
      this.firingScheduleService.firingScheduleBuildInProgress.segments.length >
      index + 1
    ) {
      //check if the next segment is a hold
      if (
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].type === 'hold'
      ) {
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].lowTemp;
        this.firingScheduleService.firingScheduleBuildInProgress.segments[index + 1].highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].lowTemp;
        //recursive call to set the low temp of the next segment
        this.setLowTemp(index + 1);
      } else if (
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].type === 'cool'
      ) {
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].lowTemp;
      } else if (
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].type === 'ramp'
      ) {
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].lowTemp;
      }
    }
    this.updateChildChart();
  }

  setHighTemp(index: number) {

    //check for valid input
    if (this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp.toString().length > 4) {
      this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp = parseInt(this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp.toString().substring(0, 4));
    }
    if (this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp > this.firingScheduleService.firingScheduleBuildInProgress.maxTemp) {
      this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp = this.firingScheduleService.firingScheduleBuildInProgress.maxTemp;
    }
    if (this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp < this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp) {
      this.firingScheduleService.firingScheduleBuildInProgress.segments[index].highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[index].lowTemp + 1;
    }

    //check if there is a segment after this one
    if (
      this.firingScheduleService.firingScheduleBuildInProgress.segments.length >
      index + 1
    ) {
      //check if the next segment is a hold
      if (
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].type === 'hold'
      ) {
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].highTemp;
        this.firingScheduleService.firingScheduleBuildInProgress.segments[index + 1].highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].highTemp;
        //recursive call to set the low temp of the next segment
        this.setHighTemp(index + 1);
      } else if (
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].type === 'cool'
      ) {
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].highTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].highTemp;
      } else if (
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].type === 'ramp'
      ) {
        this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index + 1
        ].lowTemp = this.firingScheduleService.firingScheduleBuildInProgress.segments[
          index
        ].highTemp;
      }
    }
    this.updateChildChart();
  }

  updateChildChart() {
    this.chartData = this.firingScheduleService.transformFiringSchedule(
      this.firingScheduleService.firingScheduleBuildInProgress
    );
    this.firingScheduleComponent.updateChart(
      this.chartData,
      this.firingScheduleService.firingScheduleBuildInProgress,
      this.getTotalTime()
    );
  }

  async saveFiringScheduleToFirestore() {

    if (this.firingScheduleService.firingScheduleBuildInProgress.name === '') {
      this.alertController
        .create({
          header: 'Name Your Firing Schedule',
          message: 'Please enter a name for your firing schedule.',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    const loading = await this.loadingController
      .create({
        message: 'Saving Firing Schedule...',
      });
    await loading.present();
    this.firingScheduleService.userFiringSchedules = await this.firestoreService.getUserFiringSchedules(this.auth.userMeta?.uid || '');

    console.log(this.firingScheduleService.userFiringSchedules);

    if (this.firingScheduleService.userFiringSchedules.some(schedule => schedule.name === this.firingScheduleService.firingScheduleBuildInProgress.name)) {
      await this.alertController.create({
        header: 'Firing Schedule Name Taken',
        message: 'A firing schedule with this name already exists. Please choose a different name.',
        buttons: ['OK'],
      }).then((alert) => alert.present());
      await loading.dismiss();
      return;
    }
    await this.firestoreService.upsertFiringSchedule(this.firingScheduleService.firingScheduleBuildInProgress);

    await loading.dismiss();
    this.toast.create({
      message: 'Firing Schedule Saved!',
      duration: 2000,
      color: 'success',
      position: 'bottom',
    }).then((toast) => toast.present());
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

  setItemsToFore() {
    console.log('items fore')
    this.chartContainerClass = 'chart-container rear';
    this.itemsContainerClass = 'ion-items-container fore';
  }

  setItemsToRear() {
    console.log('items rear')
    this.chartContainerClass = 'chart-container fore';
    this.itemsContainerClass = 'ion-items-container rear';
  }

  getChipColor(type: string) {
    if (type === 'ramp') {
      return 'danger';
    } else if (type === 'hold') {
      return 'warning';
    } else if (type === 'cool') {
      return 'primary';
    }
    return 'medium';
  }
}
