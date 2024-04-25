import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiringScheduleDetailPage } from './firing-schedule-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FiringScheduleDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiringScheduleDetailPageRoutingModule {}
