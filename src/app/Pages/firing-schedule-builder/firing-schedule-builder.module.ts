import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiringScheduleBuilderPageRoutingModule } from './firing-schedule-builder-routing.module';

import { FiringScheduleBuilderPage } from './firing-schedule-builder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiringScheduleBuilderPageRoutingModule
  ],
  declarations: [FiringScheduleBuilderPage]
})
export class FiringScheduleBuilderPageModule {}
