import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserRecipesPageRoutingModule } from './user-recipes-routing.module';

import { UserRecipesPage } from './user-recipes.page';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserRecipesPageRoutingModule,
    SideMenuHeaderComponent
  ],
  declarations: [UserRecipesPage]
})
export class UserRecipesPageModule {}
