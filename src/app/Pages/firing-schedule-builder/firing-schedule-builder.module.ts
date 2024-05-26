import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FiringScheduleBuilderPageRoutingModule } from './firing-schedule-builder-routing.module';

import { FiringScheduleBuilderPage } from './firing-schedule-builder.page';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { FiringScheduleComponent } from 'src/app/Components/firing-schedule/firing-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiringScheduleBuilderPageRoutingModule,
    FiringScheduleComponent,
    SideMenuHeaderComponent,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  declarations: [FiringScheduleBuilderPage]
})
export class FiringScheduleBuilderPageModule {}
