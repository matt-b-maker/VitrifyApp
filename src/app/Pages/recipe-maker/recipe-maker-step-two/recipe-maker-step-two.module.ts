import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeMakerStepTwoPageRoutingModule } from './recipe-maker-step-two-routing.module';

import { RecipeMakerStepTwoPage } from './recipe-maker-step-two.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeMakerStepTwoPageRoutingModule
  ],
  declarations: [RecipeMakerStepTwoPage]
})
export class RecipeMakerStepTwoPageModule {}
