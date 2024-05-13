import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/Models/recipeModel';
import { Status } from 'src/app/Models/status';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { RecipesService } from 'src/app/Services/recipes.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {

  loaded!: boolean;

  constructor(public recipeService: RecipesService, private authService: AuthService, private firestoreService: FirestoreService) { }

  async ngOnInit() {
    this.loaded = false;
    this.recipeService.allRecipes = await this.firestoreService.getPublicRecipes();
    this.recipeService.allRecipes.forEach((recipe) => {
      console.log(recipe.id);
    });
    this.loaded = true;
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
