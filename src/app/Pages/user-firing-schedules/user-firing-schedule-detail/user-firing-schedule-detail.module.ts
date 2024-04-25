import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserFiringScheduleDetailPageRoutingModule } from './user-firing-schedule-detail-routing.module';

import { UserFiringScheduleDetailPage } from './user-firing-schedule-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserFiringScheduleDetailPageRoutingModule
  ],
  declarations: [UserFiringScheduleDetailPage]
})
export class UserFiringScheduleDetailPageModule {}
