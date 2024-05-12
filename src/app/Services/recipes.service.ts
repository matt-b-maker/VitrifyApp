import { Injectable } from '@angular/core';
import { Recipe } from '../Models/recipeModel';
import { RecipeRevision } from '../Models/recipeRevision';

@Injectable({
  providedIn: 'root'
})

export class RecipesService {
  isEditing: boolean = true;
  isRevision: boolean = false;
  allowExit: boolean = false;

  userRecipes: Recipe[] = [];

  recipeBuildInProgess: Recipe = new Recipe("", "", "", "", '06', [new RecipeRevision(1, [])]);
  recipeEditInProgess: Recipe = new Recipe("", "", "", "", '06', [new RecipeRevision(1, [])]);
  editingRevision: number = 0;

  getRecipeById(id: string): Recipe {
    return {...this.userRecipes.find(recipe => recipe.id === id)!};
  }
}
