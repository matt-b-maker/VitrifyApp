import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeBuilderPageRoutingModule } from './recipe-builder-routing.module';

import { RecipeBuilderPage } from './recipe-builder.page';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';
import { IngredientComponent } from 'src/app/Components/ingredient/ingredient.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeBuilderPageRoutingModule,
    SideMenuHeaderComponent,
    IngredientComponent
  ],
  declarations: [RecipeBuilderPage],
})
export class RecipeBuilderPageModule {}
