import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-busy-modal',
  template: `
    <ion-content class="ion-padding w-auto h-auto ion-justify-content-center ion-align-content-center">
      <div class="ion-text-center">
        <ion-spinner name="dots"></ion-spinner>
        <h1>{{message}}</h1>
      </div>
    </ion-content>
  `
})
export class BusyModalComponent {
  @Input() message: string | undefined;

  constructor(private modalController: ModalController) {}
}
