import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeBuilderPageRoutingModule } from './recipe-builder-routing.module';

import { RecipeBuilderPage } from './recipe-builder.page';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';
import { IngredientComponent } from 'src/app/Components/ingredient/ingredient.component';
import { FilterSilicaPipe } from "../../Pipes/filter-silica.pipe";
import { FilterFluxPipe } from "../../Pipes/filter-flux.pipe";
import { IonicSelectableComponent, IonicSelectableItemEndTemplateDirective, IonicSelectableItemTemplateDirective, IonicSelectableTitleTemplateDirective, IonicSelectableValueTemplateDirective } from 'ionic-selectable';
import { MaterialsSelectComponent } from 'src/app/Components/materials-select/materials-select.component';

@NgModule({
    declarations: [RecipeBuilderPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RecipeBuilderPageRoutingModule,
        SideMenuHeaderComponent,
        IngredientComponent,
        FilterSilicaPipe,
        FilterFluxPipe,
        IonicSelectableComponent,
        IonicSelectableItemTemplateDirective,
        IonicSelectableItemEndTemplateDirective,
        IonicSelectableValueTemplateDirective,
        MaterialsSelectComponent
    ]
})
export class RecipeBuilderPageModule {}
