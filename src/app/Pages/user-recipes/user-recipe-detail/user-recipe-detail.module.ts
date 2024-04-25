import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserRecipeDetailPageRoutingModule } from './user-recipe-detail-routing.module';

import { UserRecipeDetailPage } from './user-recipe-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserRecipeDetailPageRoutingModule
  ],
  declarations: [UserRecipeDetailPage]
})
export class UserRecipeDetailPageModule {}
