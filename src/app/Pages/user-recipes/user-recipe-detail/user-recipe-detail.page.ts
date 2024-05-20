import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonModal,
  ModalController,
} from '@ionic/angular';
import { Recipe } from 'src/app/Models/recipeModel';
import { RecipesService } from 'src/app/Services/recipes.service';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { AuthService } from 'src/app/Services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { Status } from 'src/app/Models/status';
import { RecipeRevision } from 'src/app/Models/recipeRevision';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-user-recipe-detail',
  templateUrl: './user-recipe-detail.page.html',
  styleUrls: ['./user-recipe-detail.page.scss'],
})
export class UserRecipeDetailPage implements OnInit {

  public options = {
    keyboard: true
  };
  swiperModules = [IonicSlides];

  // barChartData: ChartConfiguration<'bar'>['data'] = {
  //   labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
  //   datasets: [
  //     { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
  //     { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
  //   ]
  // };

  // barChartOptions: ChartConfiguration<'bar'>['options'] = {
  //   responsive: false,
  // };

  @ViewChild(IonModal) modal!: IonModal;

  loadedRecipe!: Recipe;
  revision: number = 0;
  status = Status;
  transitionDirection: string = 'slide-up';

  allowScroll: boolean = true;
  currentSectionIndex = 0;
  sectionNames = ['Setup', 'Materials', 'Water', 'Finalize'];
  nextSectionName: string = 'Materials';
  prevSectionName: string = '';
  totalAmount: number = 100;
  waterPreference: string = 'Proportion';
  waterToDryMaterialRatio: number = 9;
  specificGravity: number = 1.55;
  waterQuantity: number = 0;

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
        this.loadedRecipe = this.recipeService.getUserRecipeById(recipeId);
        if (Object.keys(this.loadedRecipe).length === 0) {
          this.loadedRecipe = this.recipeService.getRecipeById(recipeId);
        }
        this.revision = this.loadedRecipe.revisions.length - 1;
      } else {
        //route somewhere else
        return;
      }
    });
    this.setIngredientQuantities();
    this.getWaterQuantity();
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

  async enlargeImage(index: number) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        imageUrl: this.loadedRecipe.revisions[this.revision].imageUrls[index],
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
      imageUrls: [],
      materials: lastRevision.materials.map((material) => ({ ...material })),
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
    this.route.navigate(['/recipe-maker'], {
      state: { animation: 'slide-up' },
    });
  }

  recipeIsUsers() {
    return this.loadedRecipe.uid === this.auth.userMeta?.uid;
  }

  //all modal stuff
  cancel() {
    this.currentSectionIndex = 0;
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.currentSectionIndex = 0;
    this.loadedRecipe.revisions[this.revision].status = Status.InProgress;
    await this.firestoreService.updateRecipe(this.loadedRecipe);
    this.modal.dismiss('confirm');
  }

  onWillDismiss(event: Event) {
    this.currentSectionIndex = 0;
  }

  nextSection() {
    if (this.currentSectionIndex < 3) {
      this.currentSectionIndex++;
      this.scrollToSection();
    }
    if (this.currentSectionIndex > 0) {
      this.prevSectionName = this.sectionNames[this.currentSectionIndex - 1];
    }
    if (this.currentSectionIndex < 3) {
      this.nextSectionName = this.sectionNames[this.currentSectionIndex + 1];
    }
  }

  prevSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.scrollToSection();
    }
    if (this.currentSectionIndex > 0) {
      this.prevSectionName = this.sectionNames[this.currentSectionIndex - 1];
    }
    if (this.currentSectionIndex < 3) {
      this.nextSectionName = this.sectionNames[this.currentSectionIndex + 1];
    }
  }

  scrollToSection() {
    const sectionElement = document.getElementById(
      'section-' + this.currentSectionIndex
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  scrollBack() {
    this.scrollToSection();
  }

  setBatchSize(event: any) {
    if (event.detail.value === 'custom') {
      return;
    }
    this.totalAmount = event.detail.value;
    this.setIngredientQuantities();
  }

  getWaterQuantity() {
    if (this.waterPreference === 'Proportion') {
      this.waterQuantity =
        this.totalAmount * (this.waterToDryMaterialRatio / 10);
    } else {
      this.waterQuantity = this.totalAmount * this.specificGravity;
    }
    return this.waterQuantity;
  }

  setIngredientQuantities() {
    this.loadedRecipe.revisions[this.revision].materials.forEach(
      (material) => {
        material.Quantity = (material.Percentage / 100) * this.totalAmount;
        material.Quantity = parseFloat(material.Quantity.toFixed(2)); // Round to 2 decimal places
      }
    );
  }
}
