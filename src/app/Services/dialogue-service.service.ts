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
          }
        },
        {
          text: confirm,
          handler: () => {
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role === undefined; // Return true if confirmed, false otherwise
  }

}
