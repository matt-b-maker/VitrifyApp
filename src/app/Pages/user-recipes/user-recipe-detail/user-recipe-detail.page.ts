import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/Models/recipeModel';
import { RecipesService } from 'src/app/Services/recipes.service';

@Component({
  selector: 'app-user-recipe-detail',
  templateUrl: './user-recipe-detail.page.html',
  styleUrls: ['./user-recipe-detail.page.scss'],
})
export class UserRecipeDetailPage implements OnInit {
  loadedRecipe!: Recipe;
  revision: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipesService,
    private route: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('recipeId')) {
        this.route.navigate(['/user-recipes']);
        return;
      }
      const recipeId = paramMap.get('recipeId');
      if (recipeId !== null) {
        console.log('getting recipe')
        this.loadedRecipe = this.recipeService.getRecipeById(recipeId);
        console.log('loaded recipe:', this.loadedRecipe);
      } else {
        //route somewhere else
        return;
      }
    });
  }
}
