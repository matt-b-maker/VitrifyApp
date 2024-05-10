import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeEditorPageRoutingModule } from './recipe-editor-routing.module';

import { RecipeEditorPage } from './recipe-editor.page';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';
import { IngredientComponent } from 'src/app/Components/ingredient/ingredient.component';
import { FilterSilicaPipe } from 'src/app/Pipes/filter-silica.pipe';
import { FilterFluxPipe } from 'src/app/Pipes/filter-flux.pipe';
import { IonicSelectableComponent, IonicSelectableItemEndTemplateDirective, IonicSelectableItemTemplateDirective, IonicSelectableValueTemplateDirective } from 'ionic-selectable';

@NgModule({
  declarations: [RecipeEditorPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeEditorPageRoutingModule,
    SideMenuHeaderComponent,
    IngredientComponent,
    FilterSilicaPipe,
    FilterFluxPipe,
    IonicSelectableComponent,
    IonicSelectableItemTemplateDirective,
    IonicSelectableItemEndTemplateDirective,
    IonicSelectableValueTemplateDirective
  ]
})
export class RecipeEditorPageModule {}
