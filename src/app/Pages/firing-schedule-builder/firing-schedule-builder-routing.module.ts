import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FiringScheduleBuilderPage } from './firing-schedule-builder.page';

const routes: Routes = [
  {
    path: '',
    component: FiringScheduleBuilderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiringScheduleBuilderPageRoutingModule {}
