import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { FiringDetailsService } from 'src/app/Services/firing-details.service';
import { FiringScheduleService } from 'src/app/Services/firing-schedule.service';

@Component({
  selector: 'app-user-firing-schedules',
  templateUrl: './user-firing-schedules.page.html',
  styleUrls: ['./user-firing-schedules.page.scss'],
})
export class UserFiringSchedulesPage implements OnInit {

  constructor(private firestore: FirestoreService, private auth: AuthService, public firingScheduleService: FiringScheduleService) { }

  async ngOnInit() {
    this.firingScheduleService.userFiringSchedules = await this.firestore.getUserFiringSchedules(this.auth.userMeta?.uid || '');
  }

  async deleteFiringSchedule(id: string) {
    this.firingScheduleService.userFiringSchedules.splice(this.firingScheduleService.userFiringSchedules.findIndex(schedule => schedule.id === id), 1);
    this.firestore.deleteFiringSchedule(id);
  }

}
