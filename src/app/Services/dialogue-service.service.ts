import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DialogueService {

  constructor(private alertController: AlertController) { }

  async presentConfirmationDialog(header: string, message: string, confirm: string, cancel: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: () => {
            // User clicked cancel
            console.log('Confirm Cancel');
          }
        },
        {
          text: confirm,
          handler: () => {
            // User clicked confirm
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    return role === undefined; // Return true if confirmed, false otherwise
  }

}
