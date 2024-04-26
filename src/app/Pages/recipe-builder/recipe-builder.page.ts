import { Component, OnInit, Output } from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { Recipe } from 'src/app/Models/recipeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-recipe-builder',
  templateUrl: './recipe-builder.page.html',
  styleUrls: ['./recipe-builder.page.scss'],
})
export class RecipeBuilderPage {

  chipLabel: string = 'Remove things';
  removeIconsShowing: boolean = false;

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

  silicas: string[] = this.ingredientTypes.silicaSources;

  name: string = "";
  cone: number = 0;
  description: string = "";

  constructor(private auth: AuthService, private ingredientTypes: IngredientTypesService) {
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

  addSilica() {
    this.ingredients.push(new Ingredient('', 'silica', 0, 0));
    this.chipLabel = 'Remove things';
    this.removeIconsShowing = false;
  }

  activateChip() {
    this.chipLabel = this.chipLabel === 'Done' ? 'Remove things' : 'Done';
    this.removeIconsShowing = this.chipLabel === 'Done';
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  anyIngredients() {
    return this.ingredients.length > 0;
  }

  onPercentageValueChange(index: number, event: any) {
    this.ingredients[index].percentage = parseInt(event);
  }
}
