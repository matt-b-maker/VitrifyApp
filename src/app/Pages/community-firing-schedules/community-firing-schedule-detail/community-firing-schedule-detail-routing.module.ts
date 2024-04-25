import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityFiringScheduleDetailPage } from './community-firing-schedule-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityFiringScheduleDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityFiringScheduleDetailPageRoutingModule {}
