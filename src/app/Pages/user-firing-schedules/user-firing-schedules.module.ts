import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserFiringSchedulesPageRoutingModule } from './user-firing-schedules-routing.module';

import { UserFiringSchedulesPage } from './user-firing-schedules.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserFiringSchedulesPageRoutingModule
  ],
  declarations: [UserFiringSchedulesPage]
})
export class UserFiringSchedulesPageModule {}
