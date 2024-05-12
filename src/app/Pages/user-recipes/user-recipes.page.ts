import { LowerCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/recipeModel';
import { Status } from 'src/app/Models/status';
import { UserMeta } from 'src/app/Models/userMetaModel';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { RecipesService } from 'src/app/Services/recipes.service';

@Component({
  selector: 'app-user-recipes',
  templateUrl: './user-recipes.page.html',
  styleUrls: ['./user-recipes.page.scss'],
})
export class UserRecipesPage implements OnInit {
  loaded: boolean = false;
  title: string = 'Your Glaze Recipes';
  userRecipes: Recipe[] = [];
  userMeta: UserMeta | null = this.auth.userMeta;

  constructor(
    private auth: AuthService,
    private firestore: FirestoreService,
    private router: Router,
    public recipeService: RecipesService
  ) {
    console.log('UserRecipesPage constructor')
  }

  async ngOnInit() {
    console.log('UserRecipesPage ngOnInit')
    this.loaded = false;
    this.recipeService.userRecipes = await this.firestore.getUserRecipes(this.auth.user?.uid || '');
    this.loaded = true;
  }

  goToRecipeBuilder() {
    this.router.navigate(['/recipe-builder']);
  }

  editRecipe() {
    this.recipeService.isEditing = true;
    this.router.navigate(['/recipe-builder']);
  }

  getLowestStatusName(recipe: Recipe): Status {
    let lowestStatus: string = Status.Tested;
    let lowestStatusFound: boolean = false;
    recipe.revisions.forEach((revision) => {
      if (lowestStatusFound) {
        return;
      }
      if (revision.status === Status.InProgress && lowestStatus !== Status.New) {
        lowestStatus = Status.InProgress;
        return;
      }
      if (revision.status === Status.New) {
        lowestStatus = Status.New;
        lowestStatusFound = true;
        return;
      }
    });
    return lowestStatus as Status;
  }

  getChipColor(status: Status) {
    if (status === Status.New) {
      return 'success';
    } else if (status === Status.InProgress) {
      return 'warning';
    } else if (status === Status.Tested) {
      return 'danger';
    } else {
      return 'medium';
    }
  }
}
