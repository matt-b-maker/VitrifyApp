import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Recipe } from 'src/app/Models/recipeModel';
import { RecipesService } from 'src/app/Services/recipes.service';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { AuthService } from 'src/app/Services/auth.service';
import { v4 as uuidv4 } from 'uuid';

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
    private alertController: AlertController,
    private auth: AuthService
  ) {
  }

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
        imageUrl: this.loadedRecipe.revisions[this.revision].imageUrl,
      }
    });
    return await modal.present();
  }

  goToRecipeEditor() {
    this.recipeService.isEditing = true;
    if (this.loadedRecipe.uid !== this.auth.userMeta?.uid) {
      this.alertController.create({
        header: 'Hold up..',
        message: 'You are about to edit a recipe that is not yours, essentially making it your own. Are you sure you want to continue?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Let\'s go',
            handler: () => {
              this.recipeService.recipeEditInProgess = this.loadedRecipe;
              this.recipeService.editingRevision = this.revision;
              this.recipeService.recipeEditInProgess.id = uuidv4();
              this.recipeService.recipeEditInProgess.uid = this.auth.userMeta?.uid || ''
              this.route.navigate(['/recipe-editor']);
            }
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }
    this.recipeService.recipeEditInProgess = this.loadedRecipe;
    this.recipeService.editingRevision = this.revision;
    this.route.navigate(['/recipe-editor']);
  }
}
