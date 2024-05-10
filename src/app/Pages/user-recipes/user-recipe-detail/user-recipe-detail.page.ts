import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Recipe } from 'src/app/Models/recipeModel';
import { RecipesService } from 'src/app/Services/recipes.service';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { FirestoreService } from 'src/app/Services/firestore.service';

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
    private firestoreService: FirestoreService,
    private route: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('recipeId')) {
        this.route.navigate(['/user-recipes']);
        return;
      }
      const recipeId = paramMap.get('recipeId');
      if (recipeId !== null) {
        this.loadedRecipe = this.recipeService.getRecipeById(recipeId);
        this.revision = this.loadedRecipe.revisions.length - 1;
        console.log(this.loadedRecipe)
      } else {
        //route somewhere else
        return;
      }
    });
  }

  deleteRecipe() {
    this.alertController.create({
      header: 'Delete Recipe',
      message: 'Are you sure you want to delete this recipe?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.recipeService.userRecipes = this.recipeService.userRecipes.filter(recipe => recipe.id !== this.loadedRecipe.id);
            this.firestoreService.delete('recipes', this.loadedRecipe.id);
            this.route.navigate(['/user-recipes']);
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  async enlargeImage() {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQFT0S0HD66YJrrl0wG4enGubrzaOJ6zlvkEtj-0tkuFztLPfnFYhk57sO1oA1RpofabeyLielFi-S17byojQryzuOpZds0WyK1s5i_QKh6qT1MgRjVLC711s7g4FjKnzVfKJDaxgM&usqp=CAc"
      }
    });
    return await modal.present();
  }
}
