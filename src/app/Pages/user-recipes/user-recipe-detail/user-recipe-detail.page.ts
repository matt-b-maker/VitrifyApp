import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonInput,
  IonModal,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Recipe } from 'src/app/Models/recipeModel';
import { RecipesService } from 'src/app/Services/recipes.service';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { AuthService } from 'src/app/Services/auth.service';
import { parse, v4 as uuidv4 } from 'uuid';
import { Status } from 'src/app/Models/status';
import { RecipeRevision } from 'src/app/Models/recipeRevision';
import { IonicSlides } from '@ionic/angular';
import { InventoryService } from 'src/app/Services/inventory.service';
import { Subscription, fromEvent } from 'rxjs';
import { Comment } from 'src/app/Models/commentModel';
import { Timestamp } from 'firebase/firestore';
import { ChemistryCalculatorService } from 'src/app/Services/chemistry-calculator.service';
import { Share } from '@capacitor/share';

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
  @ViewChild('commentInput') commentInput!: ElementRef;

  loadedRecipe!: Recipe;
  revision: number = 0;
  status = Status;
  transitionDirection: string = 'slide-up';

  allowScroll: boolean = true;
  currentSectionIndex = 0;
  sectionNames = ['Setup', 'Materials', 'Water', 'Finalize'];
  nextSectionName: string = 'Materials';
  prevSectionName: string = '';
  selectedBatchSize: string = '100';
  testBatchSize: number = 100;
  mediumBatchSize: number = 500;
  largeBatchSize: number = 1000;
  customBatchSize: number = 0;
  customBatch: boolean = false;
  batchUnit: string = 'g';
  batchUnits: string[] = ['g', 'kg', 'lb', 'oz'];
  totalBatchSize: number = 100;
  waterPreference: string = 'Proportion';
  waterToDryMaterialRatio: number = 9;
  specificGravity: number = 1.55;
  waterQuantity: number = 0;
  checkInventory: boolean = false;
  inventoryOptionShowing: boolean = false;
  userHasInventory: boolean = false;
  consumeInventory: boolean = false;
  makeRecipeModalOpen: boolean = false;
  commentModalOpen: boolean = false;
  commentContent: string = '';
  comments: Comment[] = [];
  isUserRecipe: boolean = false;
  recipeId: string = '';

  backbuttonSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipesService,
    private firestoreService: FirestoreService,
    private route: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private auth: AuthService,
    private inventoryService: InventoryService,
    private toastController: ToastController,
    private chemistryCalculator: ChemistryCalculatorService
  ) {
  }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (paramMap) => {
      if (!paramMap.has('recipeId')) {
        this.route.navigate(['/user-recipes']);
        return;
      }
      const recipeId = paramMap.get('recipeId');
      if (recipeId !== null) {
        this.loadedRecipe = this.recipeService.getUserRecipeById(recipeId);
        if (Object.keys(this.loadedRecipe).length === 0) {
          this.loadedRecipe = this.recipeService.getPublicRecipeById(recipeId);
        }
        this.checkIsUserRecipe();
        this.revision = this.loadedRecipe.revisions.length - 1;
      } else {
        //route somewhere else
        return;
      }
    });
    this.firestoreService.getCommentsByRecipeIdObservable(this.loadedRecipe.id).subscribe(comments => {
      this.comments = comments;
      this.comments = this.comments.sort((a, b) => {
        //date created is a timestamp here
        let aTimestamp = a.dateCreated as unknown as Timestamp;
        let bTimestamp = b.dateCreated as unknown as Timestamp;
        return bTimestamp.toMillis() - aTimestamp.toMillis();
      });
    });
    //sort comments by date: 6/3 before 6/1
    await this.inventoryService.getUserInventory();
    this.setIngredientQuantities();
    this.getWaterQuantity();
    this.inventoryOptionShowing = this.inventoryService.userInventory !== null && this.inventoryService.userInventory !== undefined && this.inventoryService.userInventory.inventory.length > 0;
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
      const modal = await this.modalController.getTop();
      if (modal) {
        modal.dismiss();
      }
    });

    console.log(this.loadedRecipe.revisions[this.revision]);

    let materials = this.chemistryCalculator.getMaterialsFromNames(this.loadedRecipe.revisions[this.revision].materials);

    let umf: Map<string, number> = this.chemistryCalculator.calculateUMF(
      this.chemistryCalculator.normalizeFluxes(
        this.chemistryCalculator.calculateTotalOxides(materials)
      ),
      this.chemistryCalculator.calculateTotalOxides(materials)
    );

    console.log(umf);
  }

  setWaterToDryMaterialRatio(event: any) {
    if (this.waterToDryMaterialRatio < 1) {
      this.waterToDryMaterialRatio = 1;
    }
    if (this.waterToDryMaterialRatio > 10) {
      this.waterToDryMaterialRatio = 10;
    }
    this.getWaterQuantity();
  }

  async shareDeepLink() {
    const deepLink = 'https://resilient-stardust-d78e45.netlify.app/user-recipes/' + this.loadedRecipe.id;
    await Share.share({
      title: 'Check out this recipe!',
      text: 'Take a look at this recipe I found:',
      url: deepLink,
      dialogTitle: 'Share this recipe'
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

  async goToRecipeEditor() {
    this.recipeService.isEditing = true;
    this.recipeService.isRevision = false;
    if (this.loadedRecipe.uid !== this.auth.userMeta?.uid) {
      await this.alertController
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
    } else {
      this.recipeService.recipeEditInProgess = this.loadedRecipe;
      this.recipeService.editingRevision = this.revision;
      this.route.navigate(['/recipe-editor']);
    }
  }

  checkIsUserRecipe() {
    this.isUserRecipe = this.loadedRecipe.uid === this.auth.userMeta?.uid;
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

  setCheckInventory(event: any) {
    this.checkInventory = event.detail.checked;
  }

  checkInventoryForMaterial(materialName: string) {
    return this.inventoryService.userInventory.inventory.some((item) => item.Name === materialName);
  }

  checkInventoryForQuantity(materialName: string, quantity: number, unit: string) {
    if (!this.userHasInventory) return;
    const inventoryItem = this.inventoryService.userInventory.inventory.find((item) => item.Name === materialName);
    if (inventoryItem) {
      if (inventoryItem.Quantity >= quantity) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  setConsumeInventory(event: any) {
    this.consumeInventory = event.detail.checked;
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
  setMakeRecipeModalOpen() {
    if (this.selectedBatchSize === 'custom') {
      this.customBatch = true;
    }
    let hasAllMaterials = true;
    this.userHasInventory = this.inventoryService.userInventory !== null && this.inventoryService.userInventory !== undefined && this.inventoryService.userInventory.inventory.length > 0;
    if (this.userHasInventory && this.checkInventory) {
      this.loadedRecipe.revisions[this.revision].materials.every((material) => {
        if (!this.checkInventoryForMaterial(material.Name)) {
          hasAllMaterials = false;
          return false;
        }
        return true;
      });
    }
    if (!hasAllMaterials) {
      this.alertController
        .create({
          header: 'Missing Materials',
          message:
            'You do not have all the materials needed to make this recipe. Would you like to continue anyway?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Yup, let\'s go',
              handler: () => {
                this.makeRecipeModalOpen = true;
              },
            },
          ],
        })
        .then(async (alertEl) => {
          await alertEl.present();
        });
    } else {
      this.makeRecipeModalOpen = true;
    }
  }

  async addComment() {
    this.commentModalOpen = true;
  }

  async confirmComment() {
    //set up new comment with all its info
    const newComment = {
      id: uuidv4(),
      creatorProfileImageUrl: this.auth.userMeta?.photoUrl || '',
      content: this.commentContent,
      creatorName: this.auth.userMeta?.nickname || this.auth.userMeta?.displayName || 'user unknown',
      creatorUid: this.auth.userMeta?.uid || '',
      dateCreated: new Date(),
      type: 'post',
      parentCommentId: '',
      recipeId: this.loadedRecipe.id,
      comments: [],
    };
    this.comments.push(newComment);

    this.comments = this.comments.sort((a, b) => a.dateCreated.getTime() - b.dateCreated.getTime());

    //update the recipe in firestore
    await this.firestoreService.upsertComment(newComment);

    //close the modal
    this.commentContent = '';
    this.commentModalOpen = false;

    //show a toast
    const toast = await this.toastController.create({
      message: 'Comment added!',
      duration: 2000,
    });
    toast.present();
  }

  cancelComment() {
    this.commentContent = '';
    this.commentModalOpen = false;
  }

  // handleReplyComment(event: Comment) {
  //   console.log(event);
  //   //find the parent comment
  //   const parentComment = this.comments.find((comment) => comment.id === event.parentCommentId);
  //   if (parentComment) {
  //     parentComment.comments.push(event);
  //     this.firestoreService.upsertComment(parentComment);
  //   }
  // }

  handleReplyComment(newReply: Comment) {
    console.log(newReply)
    this.addNestedComment(this.comments, newReply);
    this.firestoreService.upsertComments(this.comments).then(() => {
      console.log('Comments updated in Firestore');
    }).catch(error => {
      console.error('Error updating comments in Firestore: ', error);
    });
  }

  addNestedComment(comments: Comment[], newReply: Comment) {
    for (let comment of comments) {
      if (comment.id === newReply.parentCommentId) {
        comment.comments.push(newReply);
        return;
      } else if (comment.comments && comment.comments.length > 0) {
        this.addNestedComment(comment.comments, newReply);
      }
    }
  }

  cancel() {
    this.currentSectionIndex = 0;
    this.nextSectionName = 'Materials';
    this.makeRecipeModalOpen = false;
    this.customBatch = false;
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

  setCustomBatchSize(event: any) {
    this.totalBatchSize = event.detail.value;
    this.customBatchSize = event.detail.value;
    this.setIngredientQuantities();
  }

  setBatchSize(event: any) {
    this.selectedBatchSize = event.detail.value;
    if (event.detail.value === 'custom') {
      this.customBatch = true;
      return;
    }
    console.log(event.detail.value)
    this.customBatch = false;
    this.totalBatchSize = event.detail.value;
    this.setIngredientQuantities();
  }

  setBatchUnit(event: any) {
    let previousUnit = this.batchUnit;
    this.batchUnit = event.detail.value;
    this.totalBatchSize = this.convertToUnit(this.totalBatchSize, previousUnit, this.batchUnit);
    this.testBatchSize = this.convertToUnit(this.testBatchSize, previousUnit, this.batchUnit);
    this.mediumBatchSize = this.convertToUnit(this.mediumBatchSize, previousUnit, this.batchUnit);
    this.largeBatchSize = this.convertToUnit(this.largeBatchSize, previousUnit, this.batchUnit);
    this.customBatchSize = this.convertToUnit(this.customBatchSize, previousUnit, this.batchUnit);
    console.log(this.customBatchSize)
    this.setIngredientQuantities();
  }


  getWaterQuantity() {
    if (this.waterPreference === 'Proportion') {
      this.waterQuantity =
        this.totalBatchSize * (this.waterToDryMaterialRatio / 10);
    } else {
      this.waterQuantity = this.totalBatchSize * this.specificGravity;
    }
    return this.waterQuantity;
  }

  setIngredientQuantities() {
    this.loadedRecipe.revisions[this.revision].materials.forEach((material) => {
      material.Quantity = this.calculateQuantity(material.Percentage);
    });
  }

  calculateQuantity(percentage: number) {
    return parseFloat(((this.totalBatchSize * percentage) / 100).toFixed(2));
  }

  convertToUnit(quantity: number, previousUnit: string, currentUnit: string): number {
    if (previousUnit === currentUnit) {
      return quantity;
    }
    if (previousUnit === 'g') {
      if (currentUnit === 'kg') {
        return parseFloat((quantity / 1000).toFixed(2));
      } else if (currentUnit === 'lb') {
        return parseFloat((quantity / 453.592).toFixed(2));
      } else if (currentUnit === 'oz') {
        return parseFloat((quantity / 28.3495).toFixed(2));
      }
    } else if (previousUnit === 'kg') {
      if (currentUnit === 'g') {
        return Math.round(quantity * 1000);
      } else if (currentUnit === 'lb') {
        return parseFloat((quantity * 2.20462).toFixed(2));
      } else if (currentUnit === 'oz') {
        return parseFloat((quantity * 35.274).toFixed(2));
      }
    } else if (previousUnit === 'lb') {
      if (currentUnit === 'g') {
        return Math.round(quantity * 453.592);
      } else if (currentUnit === 'kg') {
        return parseFloat((quantity / 2.20462).toFixed(2));
      } else if (currentUnit === 'oz') {
        return parseFloat((quantity * 16).toFixed(2));
      }
    } else if (previousUnit === 'oz') {
      if (currentUnit === 'g') {
        return Math.round(quantity * 28.3495);
      } else if (currentUnit === 'kg') {
        return parseFloat((quantity / 35.274).toFixed(2));
      } else if (currentUnit === 'lb') {
        return parseFloat((quantity / 16).toFixed(2));
      }
    }
    return quantity;
  }
}
