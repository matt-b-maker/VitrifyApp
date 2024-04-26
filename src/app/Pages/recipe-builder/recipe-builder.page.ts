import { Component, OnInit, Output, ViewChildren, viewChildren } from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { Recipe } from 'src/app/Models/recipeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { v4 as uuidv4 } from 'uuid';
import { DialogueService } from 'src/app/Services/dialogue-service.service';
import { IngredientComponent } from 'src/app/Components/ingredient/ingredient.component';

@Component({
  selector: 'app-recipe-builder',
  templateUrl: './recipe-builder.page.html',
  styleUrls: ['./recipe-builder.page.scss'],
})
export class RecipeBuilderPage {
  //get all app-ingredient components
  @ViewChildren(IngredientComponent) ingredientComponents: any;

  chipLabel: string = 'Remove things';
  removeIconsShowing: boolean = false;
  totalPercentage: number = 0;
  remainingPercentage: number = 100;

  recipe: Recipe = {
    id: uuidv4(),
    name: "",
    cone: 0,
    description: "",
    silicas: [],
    fluxes: [],
    stabilizers: [],
    colorants: [],
    creator: this.auth.user?.displayName || "",
    revision: 0
  }

  ingredients: Ingredient[] = [];

  silicas: string[] = Array.from(this.ingredientTypes.silicaSources);

  name: string = "";
  cone: number = 6;
  description: string = "";

  constructor(private auth: AuthService, private ingredientTypes: IngredientTypesService, private dialogueService: DialogueService) {
    this.silicas.sort();
  }

  setName(event: any) {
    this.name = event.target.value;
  }

  setCone(event: any) {
    this.cone = event.target.value;
  }

  setDescription(event: any) {
    this.description = event.target.value;
  }

  async addSilica() {
    let cancel = false;
    if (this.ingredients.length >= 5){
      await this.dialogueService.presentConfirmationDialog('Wait a sec', 'You really want more than 5 silicas?', 'Yeah', 'No').then((result) => {
        console.log(result)
        if (result === false) {
          cancel = true;
        }
      });
    }
    if (cancel) return;
    this.ingredients.push(new Ingredient('', 'silica', 0, 0));
    this.chipLabel = 'Remove things';
    this.removeIconsShowing = false;
  }

  activateChip() {
    this.chipLabel = this.chipLabel === 'Done' ? 'Remove things' : 'Done';
    this.removeIconsShowing = this.chipLabel === 'Done';
    this.ingredientComponents.forEach((ingredientComponent: IngredientComponent) => {
      ingredientComponent.hideOrShowBadge(this.removeIconsShowing);
    });
  }

  anyIngredients() {
    return this.ingredients.length > 0;
  }

  onPercentageValueChange(index: number, event: any) {
    this.ingredients[index].percentage = parseInt(event);
    this.calculateTotalPercentage();
  }

  onRemoveIngredientEvent(event: any, index: number) {
    this.ingredients.splice(index, 1);
    this.updateSilicas();
    this.calculateTotalPercentage();
  }

  onNameValueChange(index: number, event: string) {
    this.ingredients[index].name = event;
    console.log(this.ingredients);
    this.updateSilicas();
  }

  calculateTotalPercentage() {
    this.totalPercentage = this.ingredients.reduce((acc, ingredient) => acc + ingredient.percentage, 0);
    this.remainingPercentage = 100 - this.totalPercentage;
  }

  updateSilicas() {
    this.silicas = this.ingredientTypes.silicaSources.filter((silica) => !this.ingredients.map((ingredient) => ingredient.name).includes(silica));
    this.silicas.sort();
  }
}
