import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
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

  constructor(private firestore: FirestoreService, private auth: AuthService, public firingScheduleService: FiringScheduleService, private alertController: AlertController, private toastController: ToastController) { }

  async ngOnInit() {
    this.firingScheduleService.userFiringSchedules = await this.firestore.getUserFiringSchedules(this.auth.userMeta?.uid || '');
  }

  async deleteFiringSchedule(id: string) {

    const name = this.firingScheduleService.userFiringSchedules.find(schedule => schedule.id === id)?.name;

    await this.alertController.create({
      header: 'Delete Firing Schedule',
      message: 'Are you sure you want to delete this firing schedule?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            console.log(id);
            await this.firestore.deleteFiringSchedule(id);
            this.firingScheduleService.userFiringSchedules = await this.firestore.getUserFiringSchedules(this.auth.userMeta?.uid || '');
          }
        }
      ]
    }).then(alert => alert.present());

    this.toastController.create({
      message: `Firing Schedule ${name} deleted`,
      duration: 2000
    }).then(toast => toast.present());
  }

}
