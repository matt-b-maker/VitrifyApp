import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/recipeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { RecipesService } from 'src/app/Services/recipes.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.page.html',
  styleUrls: ['./user-recipes.page.scss'],
})
export class UserRecipesPage {
  loaded: boolean = false;
  title: string = '';
  userRecipes: Recipe[] = [];

  constructor(private auth: AuthService, private firestore: FirestoreService, private router: Router, private recipeService: RecipesService) {
    (async () => {
      let userDisplayName = this.auth.user?.displayName || '';
      this.title = userDisplayName === '' ? 'User Recipes' : userDisplayName + '\'s Recipes';
      await this.initializeRecipes();
    })();
  }

   async initializeRecipes(): Promise<void> {
    this.loaded = false;
    let uid = this.auth.user?.uid || '';
    if (!uid) return console.error('User not logged in');
    console.log('User ID:', uid);
    await this.firestore.getUserRecipes(uid).then((recipes) => {
      this.userRecipes = recipes;
      this.recipeService.recipes = recipes;
      console.log('User recipes:', this.userRecipes);
    });
    this.loaded = true;
  }

  goToRecipeBuilder() {
    this.router.navigate(['/recipe-builder']);
  }

  editRecipe() {
  }
}
