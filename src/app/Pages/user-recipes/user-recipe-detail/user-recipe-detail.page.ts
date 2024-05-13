import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationBuilder, IonModal, ModalController } from '@ionic/angular';
import { Recipe } from 'src/app/Models/recipeModel';
import { RecipesService } from 'src/app/Services/recipes.service';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { AuthService } from 'src/app/Services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { Status } from 'src/app/Models/status';
import { RecipeRevision } from 'src/app/Models/recipeRevision';

@Component({
  selector: 'app-user-recipe-detail',
  templateUrl: './user-recipe-detail.page.html',
  styleUrls: ['./user-recipe-detail.page.scss'],
})
export class UserRecipeDetailPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  loadedRecipe!: Recipe;
  revision: number = 0;
  status = Status;
  transitionDirection: string = 'slide-up';

  allowScroll:boolean = true;
  currentSectionIndex = 0;
  totalAmount: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipesService,
    private firestoreService: FirestoreService,
    private route: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private auth: AuthService,
    private changeDetector: ChangeDetectorRef
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
      } else {
        //route somewhere else
        return;
      }
    });
  }

  deleteRecipe() {
    this.alertController
      .create({
        header: 'Delete Recipe',
        message: 'Are you sure you want to delete this recipe?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              this.recipeService.userRecipes =
                this.recipeService.userRecipes.filter(
                  (recipe) => recipe.id !== this.loadedRecipe.id
                );
              this.firestoreService.delete('recipes', this.loadedRecipe.id);
              this.route.navigate(['/user-recipes']);
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  async enlargeImage() {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        imageUrl: this.loadedRecipe.revisions[this.revision].imageUrl,
      },
    });
    return await modal.present();
  }

  moveRevisionToTested() {
    //make sure the user knows what they are doing
    this.alertController
      .create({
        header: 'Move to Tested',
        message:
          'Are you sure you want to move this revision to tested? This will cement you in the halls of glaze lore forever.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Move',
            handler: () => {
              this.loadedRecipe.revisions[this.revision].status = Status.Tested;
              this.firestoreService.updateRecipe(this.loadedRecipe);
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  goToRecipeEditor() {
    this.recipeService.isEditing = true;
    this.recipeService.isRevision = false;
    if (this.loadedRecipe.uid !== this.auth.userMeta?.uid) {
      this.alertController
        .create({
          header: 'Hold up..',
          message:
            'You are about to edit a recipe that is not yours, essentially making it your own. Are you sure you want to continue?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: "Let's go",
              handler: () => {
                this.recipeService.recipeEditInProgess = this.loadedRecipe;
                this.recipeService.editingRevision = this.revision;
                this.recipeService.recipeEditInProgess.id = uuidv4();
                this.recipeService.recipeEditInProgess.uid =
                  this.auth.userMeta?.uid || '';
                this.route.navigate(['/recipe-editor']);
              },
            },
          ],
        })
        .then((alertEl) => {
          alertEl.present();
        });
    }
    this.recipeService.recipeEditInProgess = this.loadedRecipe;
    this.recipeService.editingRevision = this.revision;
    this.route.navigate(['/recipe-editor']);
  }

  isUserRecipe() {
    return this.loadedRecipe.uid === this.auth.userMeta?.uid;
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

  addRevision() {
    const lastRevision =
      this.loadedRecipe.revisions[this.loadedRecipe.revisions.length - 1];
    let newRevision: RecipeRevision = {
      ...lastRevision,
      revision: this.loadedRecipe.revisions.length + 1,
      status: Status.New,
      imageUrl: '',
      ingredients: lastRevision.ingredients.map((ing) => ({ ...ing })),
    };

    this.recipeService.recipeEditInProgess = {
      ...this.loadedRecipe,
      revisions: [...this.loadedRecipe.revisions, newRevision],
    };

    this.recipeService.editingRevision =
      this.recipeService.recipeEditInProgess.revisions.length - 1;
    this.recipeService.isRevision = true;
    this.route.navigate(['/recipe-editor']);
  }

  setRevision(event: any) {
    this.revision = event.detail.value - 1;
  }

  navigateToRecipeMaker() {
    this.route.navigate(['/recipe-maker'], { state: { animation: 'slide-up' } });
  }

  //all modal stuff
  cancel() {
    this.currentSectionIndex = 0;
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.currentSectionIndex = 0;
    this.modal.dismiss('confirm');
  }

  onWillDismiss(event: Event) {
    console.log(this.currentSectionIndex);
    this.currentSectionIndex = 0;
  }

  nextSection() {
    if (this.currentSectionIndex < 3) {
      this.currentSectionIndex++;
      this.scrollToSection();
    }
  }

  prevSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.scrollToSection();
    }
  }

  scrollToSection() {
    const sectionElement = document.getElementById('section-' + this.currentSectionIndex);
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
