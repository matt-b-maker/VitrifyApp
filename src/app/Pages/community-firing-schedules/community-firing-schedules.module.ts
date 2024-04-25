import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityFiringSchedulesPageRoutingModule } from './community-firing-schedules-routing.module';

import { CommunityFiringSchedulesPage } from './community-firing-schedules.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityFiringSchedulesPageRoutingModule
  ],
  declarations: [CommunityFiringSchedulesPage]
})
export class CommunityFiringSchedulesPageModule {}
