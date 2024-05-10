import { Injectable } from '@angular/core';
import { Recipe } from '../Models/recipeModel';
import { RecipeRevision } from '../Models/recipeRevision';

@Injectable({
  providedIn: 'root'
})

export class RecipesService {
  isEditing: boolean = true;

  userRecipes: Recipe[] = [];

  recipeInProgess: Recipe = new Recipe("", "", "", "", '06', [new RecipeRevision(1, [])]);

  getRecipeById(id: string): Recipe {
    return this.userRecipes.find(recipe => recipe.id === id)!;
  }
}
