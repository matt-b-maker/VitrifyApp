import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityRecipeDetailPageRoutingModule } from './community-recipe-detail-routing.module';

import { CommunityRecipeDetailPage } from './community-recipe-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityRecipeDetailPageRoutingModule
  ],
  declarations: [CommunityRecipeDetailPage]
})
export class CommunityRecipeDetailPageModule {}
