import { Injectable } from '@angular/core';
import { Recipe } from '../Models/recipeModel';
import { RecipeRevision } from '../Models/recipeRevision';
import { Ingredient } from '../Models/ingredientModel';

@Injectable({
  providedIn: 'root'
})

export class RecipesService {
  recipes: Recipe[] = [
  ];

  recipeInProgess: Recipe = new Recipe("", "", "", "", '06', [new RecipeRevision(1, [new Ingredient("", {composition: "", colorClass: ""}, "", 0, 0)])]);

  constructor() { }

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipeById(id: string) {
    return {...this.recipes.find(recipe => recipe.id === id)};
  }

  updateRecipe(id: string, newRecipe: Recipe){
    let recipe = this.recipes.find(recipe => recipe.id === id);
    recipe = newRecipe;
  }
}
