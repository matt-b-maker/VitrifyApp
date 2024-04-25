import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiringScheduleDetailPageRoutingModule } from './firing-schedule-detail-routing.module';

import { FiringScheduleDetailPage } from './firing-schedule-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiringScheduleDetailPageRoutingModule
  ],
  declarations: [FiringScheduleDetailPage]
})
export class FiringScheduleDetailPageModule {}
