import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipePageRoutingModule } from './recipe-routing.module';

import { RecipePage } from './recipe.page';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';
import { IngredientComponent } from 'src/app/Components/ingredient/ingredient.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipePageRoutingModule,
    SideMenuHeaderComponent,
    IngredientComponent
  ],
  declarations: [RecipePage]
})
export class RecipePageModule {}
