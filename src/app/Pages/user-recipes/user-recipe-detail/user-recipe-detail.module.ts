import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserRecipeDetailPageRoutingModule } from './user-recipe-detail-routing.module';

import { UserRecipeDetailPage } from './user-recipe-detail.page';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserRecipeDetailPageRoutingModule,
    BaseChartDirective
  ],
  declarations: [UserRecipeDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserRecipeDetailPageModule {}
