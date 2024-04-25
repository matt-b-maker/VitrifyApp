import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityFiringSchedulesPage } from './community-firing-schedules.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityFiringSchedulesPage
  },  {
    path: 'community-firing-schedule-detail',
    loadChildren: () => import('../../Pages/community-firing-schedules/community-firing-schedule-detail/community-firing-schedule-detail.module').then( m => m.CommunityFiringScheduleDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityFiringSchedulesPageRoutingModule {}
