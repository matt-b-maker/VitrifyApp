import { Injectable } from '@angular/core';
import { FiringSchedule } from '../Models/FiringScheduleModel';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { Segment } from '../Models/segment';

@Injectable({
  providedIn: 'root'
})
export class FiringScheduleService {

  userFiringSchedules: FiringSchedule[] = [];

  firingScheduleBuildInProgress: FiringSchedule = new FiringSchedule('', '', '', '', [new Segment(70, 200, '01:00')]);

  constructor(private firestore: FirestoreService, private auth: AuthService) {

  }

  async getUserFiringSchedules() {
    this.userFiringSchedules = await this.firestore.getUserFiringSchedules(this.auth.userMeta?.uid || '');
  }
}
