import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityFiringScheduleDetailPageRoutingModule } from './community-firing-schedule-detail-routing.module';

import { CommunityFiringScheduleDetailPage } from './community-firing-schedule-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityFiringScheduleDetailPageRoutingModule
  ],
  declarations: [CommunityFiringScheduleDetailPage]
})
export class CommunityFiringScheduleDetailPageModule {}
