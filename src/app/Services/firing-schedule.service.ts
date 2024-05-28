import { Injectable } from '@angular/core';
import { FiringSchedule } from '../Models/firingScheduleModel';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { Segment } from '../Models/segment';

@Injectable({
  providedIn: 'root'
})
export class FiringScheduleService {

  userFiringSchedules: FiringSchedule[] = [];
  allFiringSchedules: FiringSchedule[] = [];
  isEditing: boolean = true;

  firingScheduleBuildInProgress: FiringSchedule = new FiringSchedule('', '', '', '', [new Segment(70, 200, '01:00', 'ramp')]);
  firingScheduleEditInProgress: FiringSchedule = new FiringSchedule('', '', '', '', [new Segment(70, 200, '01:00', 'ramp')]);

  constructor(private firestore: FirestoreService, private auth: AuthService) {

  }

  async getUserFiringSchedules() {
    this.userFiringSchedules = await this.firestore.getUserFiringSchedules(this.auth.userMeta?.uid || '');
  }

  transformFiringSchedule(schedule: FiringSchedule) {
    let time: number = 0;
    let data = [] as [number, number, string][]; // Array of [time, temperature] pairs

    schedule.segments.forEach((segment) => {
      let durationMinutes =
        parseInt(segment.duration.split(':')[0]) * 60 +
        parseInt(segment.duration.split(':')[1]);

      // If the segment is the first one
      if (schedule.segments.indexOf(segment) === 0) {
        data.push([time / 60, segment.lowTemp, '#800000']); // Convert minutes to hours
        time += durationMinutes;
        data.push([
          time / 60,
          segment.hold ? segment.lowTemp : segment.highTemp, '#800000'
        ]); // Convert minutes to hours
        return;
      }

      // For non-first segments, update data with color based on type
      time += durationMinutes;
      let dataTemp: number = 0;
      let segmentColor: string = '#800000'; // default color (red)
      if (segment.type === 'ramp') {
        dataTemp = segment.highTemp;
        segmentColor = '#FF0000'; // red
      } else if (segment.type === 'hold') {
        dataTemp = segment.lowTemp;
        segmentColor = '#0000FF'; // blue
      } else if (segment.type === 'cool') {
        dataTemp = segment.lowTemp;
        segmentColor = '#008000'; // green
      }
      data.push([time / 60, dataTemp, segmentColor]);
    });

    return data;
  }
}
