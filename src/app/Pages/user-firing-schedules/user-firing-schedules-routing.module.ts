import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFiringSchedulesPage } from './user-firing-schedules.page';

const routes: Routes = [
  {
    path: '',
    component: UserFiringSchedulesPage
  },  {
    path: 'user-firing-schedule-detail',
    loadChildren: () => import('../../Pages/user-firing-schedules/user-firing-schedule-detail/user-firing-schedule-detail.module').then( m => m.UserFiringScheduleDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserFiringSchedulesPageRoutingModule {}
