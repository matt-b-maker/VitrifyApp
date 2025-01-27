import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFiringScheduleDetailPage } from './user-firing-schedule-detail.page';

const routes: Routes = [
  {
    path: '',
    component: UserFiringScheduleDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserFiringScheduleDetailPageRoutingModule {}
