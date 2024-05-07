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

  recipeInProgess: Recipe = new Recipe("", "", "", "", '06', [new RecipeRevision(1, [])]);

  getRecipeById(id: string): Recipe {
    return this.recipes.find(recipe => recipe.id === id)!;
  }
}
