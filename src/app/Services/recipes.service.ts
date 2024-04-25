import { Injectable } from '@angular/core';
import { Recipe } from '../Models/recipeModel';

@Injectable({
  providedIn: 'root'
})

export class RecipesService {

  recipes: Recipe[] = [
    //create three random recipes

  ];
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
