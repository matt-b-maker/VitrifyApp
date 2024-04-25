import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityRecipesPageRoutingModule } from './community-recipes-routing.module';

import { CommunityRecipesPage } from './community-recipes.page';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityRecipesPageRoutingModule,
    SideMenuHeaderComponent
  ],
  declarations: [CommunityRecipesPage]
})
export class CommunityRecipesPageModule {}
