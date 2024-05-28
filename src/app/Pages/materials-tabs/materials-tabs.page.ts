import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-materials-tabs',
  templateUrl: './materials-tabs.page.html',
  styleUrls: ['./materials-tabs.page.scss'],
})
export class MaterialsTabsPage implements OnInit {

  backbuttonSubscription!: Subscription;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
      const modal = await this.modalController.getTop();
      if (modal) {
        modal.dismiss();
      }
    });
  }
}
