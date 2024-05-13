import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/Models/recipeModel';
import { RecipesService } from 'src/app/Services/recipes.service';

@Component({
  selector: 'app-community-recipe-detail',
  templateUrl: './community-recipe-detail.page.html',
  styleUrls: ['./community-recipe-detail.page.scss'],
})
export class CommunityRecipeDetailPage implements OnInit {

  loadedRecipe: Recipe | undefined;

  constructor(private activateRoute: ActivatedRoute, private recipesService: RecipesService) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(params => {
      if (!params.has('recipeId')) {
        //redirect to 404
        return;
      }
      var recipeId = params.get('recipeId');
      if (recipeId !== null) {
        this.loadedRecipe = this.recipesService.getUserRecipeById(recipeId) as Recipe;
      }
    });
  }

}
