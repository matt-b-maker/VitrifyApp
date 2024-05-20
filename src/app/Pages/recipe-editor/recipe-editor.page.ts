import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { DialogueService } from 'src/app/Services/dialogue-service.service';
import {
  AlertController,
  AnimationController,
  IonInput,
  LoadingController,
  isPlatform,
} from '@ionic/angular';
import { RecipesService } from 'src/app/Services/recipes.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { Router } from '@angular/router';
import { FiringDetailsService } from 'src/app/Services/firing-details.service';
import { Status } from 'src/app/Models/status';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FirebaseStorageService } from 'src/app/Services/firebase-storage.service';
import { SwiperContainer } from 'swiper/element';
import { Swiper } from 'swiper/types';

@Component({
  selector: 'app-recipe-editor',
  templateUrl: './recipe-editor.page.html',
  styleUrls: [
    './recipe-editor.page.scss',
    '../../../ionic-selectable.component.scss',
  ],
})
export class RecipeEditorPage implements AfterViewInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  lowerCone: string = '6';
  upperCone: string = '10';
  isConeRange: boolean = false;
  notes: string = '';
  firingTypes: string[] = this.firingDetailsService.firingTypes;
  allCones: string[] = this.firingDetailsService.firingCones;
  conesLowerRange: string[] = [...this.allCones];
  conesUpperRange: string[] = [
    ...this.allCones.slice(0, this.allCones.indexOf(this.lowerCone)),
  ];
  lowerConeLabel: string = 'Cone';
  upperConeLabel: string = 'Max Cone';
  remainingPercentageOver: boolean = false;
  coneRegex: RegExp = /^(0[1-9]|1[0-2]|[1-9])([-/](0[1-9]|1[0-2]|[1-9]))?$/;
  isEditing: boolean;
  //get all app-ingredient components

  totalPercentage: number = 0;
  remainingPercentage: number = 100;

  allMaterials: Ingredient[] = [
    ...this.ingredientService.allMaterials.sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
  ];

  revision: number = 0;
  statuses: string[] = [Status.New, Status.InProgress, Status.Tested];

  isMobile: boolean = false;
  cameraSource: CameraSource = CameraSource.Camera;
  photosSource: CameraSource = CameraSource.Photos;
  imagesAtMax: boolean = false;
  imageMax: number = 3;

  constructor(
    @Inject(IngredientTypesService)
    public ingredientService: IngredientTypesService,
    public recipeService: RecipesService,
    private auth: AuthService,
    private dialogueService: DialogueService,
    private animationCtrl: AnimationController,
    private alertController: AlertController,
    private firestoreService: FirestoreService,
    private router: Router,
    private firingDetailsService: FiringDetailsService,
    private loadingCtrl: LoadingController,
    private firebaseStorage: FirebaseStorageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.calculateTotalPercentage();
    this.isEditing = this.recipeService.isEditing;
    this.revision = this.recipeService.editingRevision;
    this.isMobile = isPlatform('cordova');
  }

  ngAfterViewInit() {
    this.isConeRange =
      this.recipeService.recipeEditInProgess.cone.includes('-');
    this.imagesAtMax =
      this.recipeService.recipeEditInProgess.revisions[this.revision].imageUrls
        .length >= this.imageMax;
    this.updateSwiper();
  }

  updateSwiper() {
    this.swiper?.update();
    this.swiper?.updateSlides();
    this.swiperRef?.nativeElement.swiper.update();
    this.swiperRef?.nativeElement.swiper.updateSlides();
    this.changeDetectorRef.detectChanges();
    console.log('updated swiper');
  }

  updateImage(index: number) {
    //ask user if they want to take a photo or choose from gallery
    this.dialogueService
      .presentConfirmationDialog(
        'Select Image',
        'Would you like to take a photo or choose from gallery?',
        'Take Photo',
        'Choose from Gallery'
      )
      .then((result) => {
        if (result === true) {
          this.selectImage(this.cameraSource, index);
        } else {
          this.selectImage(this.photosSource, index);
        }
      });
  }

  addImage() {
    this.recipeService.recipeEditInProgess.revisions[
      this.revision
    ].imageUrls.push('');
    this.updateImage(
      this.recipeService.recipeEditInProgess.revisions[
        this.revision
      ].imageUrls.indexOf('')
    );
    this.imagesAtMax =
      this.recipeService.recipeEditInProgess.revisions[this.revision].imageUrls
        .length >= this.imageMax;
    this.changeDetectorRef.detectChanges();
    this.updateSwiper();
  }

  async deleteImage(index: number) {
    await this.dialogueService
      .presentConfirmationDialog(
        'Delete Image',
        'Are you sure you want to delete this image?',
        'Yes',
        'No'
      )
      .then(async (result) => {
        if (result === true) {
          await this.firebaseStorage.deleteFileWithUrl(this.recipeService.recipeEditInProgess.revisions[this.revision].imageUrls[index]);
          this.recipeService.recipeEditInProgess.revisions[
            this.revision
          ].imageUrls.splice(index, 1);
          this.imagesAtMax =
            this.recipeService.recipeEditInProgess.revisions[this.revision]
              .imageUrls.length >= this.imageMax;
        }
      });
    this.changeDetectorRef.detectChanges();
    console.log('deleted');
    this.updateSwiper();
  }

  async selectImage(source: CameraSource, index: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
      spinner: 'bubbles',
      translucent: true,
    });

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: source,
      });

      if (image) {
        loading.present();
        const response = await fetch(image.webPath!);
        const blob = await response.blob();
        const filePath = `glaze_photos/${new Date().getTime()}_${
          image.format
        }/${this.recipeService.recipeEditInProgess.id}`;
        const resultUrl = await this.firebaseStorage.uploadFile(
          filePath,
          blob as File
        );
        this.recipeService.recipeEditInProgess.revisions[
          this.revision
        ].imageUrls[index] = resultUrl;
      } else {
        this.alertController
          .create({
            header: 'Error',
            message: 'Error with image',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
      }

      loading.dismiss();
    } catch (error) {
      loading.dismiss();
      console.error('Error accessing camera or gallery:', error);
    }
  }

  async uploadRevisionImage(event: any, index: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
      spinner: 'bubbles',
      translucent: true,
    });
    const file = event.target.files[0];
    if (!this.auth.user) return;
    const filePath = `glaze_photos/${new Date().getTime()}/${
      this.recipeService.recipeEditInProgess.id
    }`;
    try {
      loading.present();
      const resultUrl = await this.firebaseStorage.uploadFile(filePath, file);
      this.recipeService.recipeEditInProgess.revisions[this.revision].imageUrls[
        index
      ] = resultUrl;
      loading.dismiss();
    } catch (error) {
      loading.dismiss();
      console.error('Error uploading file:', error);
    }
  }

  setRevision(event: any) {
    this.revision = event.detail.value - 1;
    this.updateMaterialsList();
    this.calculateTotalPercentage();
    this.isConeRange =
      this.recipeService.recipeEditInProgess.cone.includes('-');
    this.imagesAtMax =
      this.recipeService.recipeEditInProgess.revisions[this.revision].imageUrls
        .length >= this.imageMax;
  }

  setStatus(event: any) {
    this.recipeService.recipeEditInProgess.revisions[this.revision].status =
      event.detail.value;
  }

  updateMaterialsList() {
    //remove any materials that are already in the recipe
    this.allMaterials = this.ingredientService.allMaterials.filter(
      (material) =>
        !this.recipeService.recipeEditInProgess.revisions[
          this.revision
        ].materials.find((material) => material.Name === material.Name)
    );
  }

  recipeComplete(): boolean {
    return (
      this.recipeService.recipeEditInProgess.name.trim() !== '' &&
      this.recipeService.recipeEditInProgess.description.trim() !== '' &&
      this.recipeService.recipeEditInProgess.cone !== '' &&
      this.recipeService.recipeEditInProgess.revisions[this.revision].materials
        .length > 0
    );
  }

  deleteRevision() {
    this.dialogueService
      .presentConfirmationDialog(
        'Delete Revision',
        'Are you sure you want to delete this revision?',
        'Yes',
        'No'
      )
      .then((result) => {
        if (result === true) {
          this.recipeService.recipeEditInProgess.revisions.splice(
            this.revision,
            1
          );
          this.revision = 0;
          this.recipeService.editingRevision = 0;
          this.calculateTotalPercentage();
        }
      });
  }

  async saveRecipeToFirestore() {
    if (this.recipeService.isRevision) {
      //check if the recipe is the same as any of the previous revisions, minus status property
      let same = false;
      let indexOfSame = -1;
      for (
        let i = 0;
        i < this.recipeService.recipeEditInProgess.revisions.length - 1;
        i++
      ) {
        //check if the revisions are the same, minus the status property
        if (
          JSON.stringify(
            this.recipeService.recipeEditInProgess.revisions[i].materials
          ) ===
          JSON.stringify(
            this.recipeService.recipeEditInProgess.revisions[this.revision]
              .materials
          )
        ) {
          same = true;
          indexOfSame = i;
          break;
        }
      }
      if (same) {
        this.alertController
          .create({
            header: 'No Changes',
            message:
              'This revision is the same as revision ' +
              (indexOfSame + 1) +
              '. Would you like to continue editing?',
            buttons: [
              {
                text: 'Yes',
                handler: () => {
                  return;
                },
              },
              {
                text: 'No, take me away',
                handler: () => {
                  this.recipeService.isRevision = false;
                  this.recipeService.allowExit = true;
                  this.router.navigate(['/user-recipes']);
                  this.recipeService.allowExit = false;
                },
              },
            ],
          })
          .then((alert) => alert.present());
        return;
      }
    }
    const loading = await this.loadingCtrl.create({
      message: 'Saving Recipe...',
      spinner: 'bubbles',
      translucent: true,
    });
    await loading.present();
    if (this.recipeService.recipeEditInProgess.uid !== this.auth.user?.uid)
      this.recipeService.recipeEditInProgess.uid = this.auth.user?.uid || '';
    this.recipeService.recipeEditInProgess.dateModified = new Date();
    await this.firestoreService.updateRecipe(
      this.recipeService.recipeEditInProgess
    );
    this.recipeService.userRecipes = await this.firestoreService.getUserRecipes(
      this.auth.user?.uid || ''
    );
    if (this.recipeService.isRevision) this.recipeService.isRevision = false;
    await loading.dismiss();
    this.alertController
      .create({
        header: 'Recipe Saved',
        message: 'Done. Would you like to go to your recipes?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.recipeService.allowExit = true;
              this.router.navigate(['/user-recipes']);
            },
          },
          {
            text: 'No',
            handler: () => {
              return;
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  //animation methods
  async slideInNewIngredient(ingredientElement: HTMLElement) {
    const slideInAnimation = this.animationCtrl
      .create()
      .addElement(ingredientElement)
      .duration(100)
      .fromTo('transform', 'translateX(100%)', 'translateX(0)')
      .fromTo('opacity', '0', '1'); // Fade in effect

    await slideInAnimation.play();
  }

  async slideUpRemainingIngredients(
    ingredientElements: HTMLElement[],
    removedIndex: number
  ) {
    if (
      ingredientElements.length === 0 ||
      removedIndex < 0 ||
      removedIndex >= ingredientElements.length
    )
      return;

    const slideUpAnimation = this.animationCtrl.create().duration(300); // Adjust duration as needed

    //slide up all elements after the one removed to fill the gap
    ingredientElements.forEach((element, index) => {
      if (index >= removedIndex) {
        slideUpAnimation
          .addElement(element)
          .fromTo(
            'transform',
            `translateY(${element.clientHeight}px)`,
            'translateY(0)'
          );
      }
    });

    await slideUpAnimation.play();
  }

  async slideOutIngredient(ingredientElement: HTMLElement) {
    const slideOutAnimation = this.animationCtrl
      .create()
      .addElement(ingredientElement)
      .duration(300)
      .fromTo('transform', 'translateX(0)', 'translateX(100%)')
      .fromTo('opacity', '1', '0'); // Fade out effect

    await slideOutAnimation.play();
  }

  trimName() {
    this.recipeService.recipeEditInProgess.name =
      this.recipeService.recipeEditInProgess.name.trim();
  }

  //property methods
  setName(event: any) {
    this.recipeService.recipeEditInProgess.name = event.target.value;
  }

  setCone(event: any) {
    this.lowerCone = event.target.value;
    this.recipeService.recipeBuildInProgess.cone = event.target.value;
  }

  setLowerCone(event: any) {
    this.lowerCone = event.target.value;
    if (this.isConeRange) {
      this.recipeService.recipeBuildInProgess.cone = `${this.lowerCone}-${this.upperCone}`;
      //modify the upper cone range to disinclude the lower cone and all cones below it
      this.conesUpperRange = [
        ...this.allCones.slice(0, this.allCones.indexOf(this.lowerCone)),
      ];
    } else {
      this.recipeService.recipeBuildInProgess.cone = event.target.value;
    }
  }

  setUpperCone(event: any) {
    this.upperCone = event.target.value;
    this.recipeService.recipeBuildInProgess.cone = `${this.lowerCone}-${this.upperCone}`;
    this.conesLowerRange = [
      ...this.allCones.slice(
        this.allCones.indexOf(this.upperCone) + 1,
        this.allCones.length
      ),
    ];
  }

  toggleConeRange() {
    this.recipeService.recipeBuildInProgess.cone = this.isConeRange
      ? `${this.lowerCone}-${this.upperCone}`
      : this.lowerCone;
    this.lowerConeLabel = this.isConeRange ? 'Min Cone' : 'Cone';
    this.conesLowerRange = this.isConeRange
      ? [
          ...this.allCones.slice(
            this.allCones.indexOf(this.upperCone) + 1,
            this.allCones.length
          ),
        ]
      : [...this.allCones];
  }

  trimDescription() {
    this.recipeService.recipeEditInProgess.description =
      this.recipeService.recipeEditInProgess.description.trim();
  }

  setDescription(event: any) {
    this.recipeService.recipeEditInProgess.description = event.target.value;
  }

  setNotes(event: any) {
    this.recipeService.recipeEditInProgess.notes = event.target.value;
  }

  async addIngredient() {
    let cancel = false;
    if (
      this.recipeService.recipeEditInProgess.revisions[this.revision].materials
        .length >= 5
    ) {
      await this.dialogueService
        .presentConfirmationDialog(
          'Wait a sec',
          `You really want more than ${
            this.recipeService.recipeEditInProgess.revisions[this.revision]
              .materials.length
          } ingredients?`,
          'Yeah',
          'No'
        )
        .then((result) => {
          if (result === false) {
            cancel = true;
          }
        });
    }

    if (cancel) return;

    this.recipeService.recipeBuildInProgess.revisions[
      this.revision
    ].materials.push({
      Name: '',
      Oxides: [],
      OxidesWeight: 0,
      Description: '',
      Percentage: 0,
      Quantity: 0,
      Hazardous: false,
    });

    //Do animation stuff
    const newIngredientIndex =
      this.recipeService.recipeEditInProgess.revisions[this.revision].materials
        .length - 1;

    // Get the last ingredient's HTML element and slide it in
    const ingredientElements = document.querySelectorAll('.w-fill-available');
    //get last element
    const newIngredientElement = ingredientElements[
      newIngredientIndex
    ] as HTMLElement;
    await this.slideInNewIngredient(newIngredientElement);

    //update percentages
    this.calculateTotalPercentage();
  }

  anyIngredients() {
    return (
      this.recipeService.recipeEditInProgess.revisions[this.revision].materials
        .length > 0
    );
  }

  setIngredientValue(event: any, index: number) {
    this.recipeService.recipeBuildInProgess.revisions[this.revision].materials[
      index
    ].Name = event.Name;
    this.updateMaterialsList();
  }

  setPercentage(event: any, index: number) {
    if (event.target.value === '' || parseFloat(event.target.value) < 1) {
      this.recipeService.recipeEditInProgess.revisions[this.revision].materials[
        index
      ].Percentage = 1;
      event.target.value = '1'; // Set the value of the input to 1
      this.calculateTotalPercentage();
      return;
    }
    //check max length
    if (event.target.value.length > 5) {
      event.target.value = event.target.value.slice(0, 5);
      return;
    }
    this.recipeService.recipeEditInProgess.revisions[this.revision].materials[
      index
    ].Percentage = parseFloat(event.target.value);
    this.calculateTotalPercentage();
  }

  async removeIngredient(index: number) {
    // Get the HTML element of the ingredient to be removed
    const ingredientElements = document.querySelectorAll('.ingredient');
    const ingredientElementToRemove = ingredientElements[index] as HTMLElement;

    //get elements after the one to be removed
    //const remainingIngredientElements: HTMLElement[] = Array.from(ingredientElements).slice(index + 1) as HTMLElement[];

    // Slide out the ingredient first, then remove it
    await this.slideOutIngredient(ingredientElementToRemove);
    this.recipeService.recipeEditInProgess.revisions[
      this.revision
    ].materials.splice(index, 1);
    this.updateMaterialsList();
    this.calculateTotalPercentage();
  }

  calculateTotalPercentage() {
    if (
      this.recipeService.recipeEditInProgess.revisions[this.revision].materials
        .length === 0
    ) {
      this.totalPercentage = 0;
      this.remainingPercentage = 100;
      return;
    }
    this.totalPercentage =
      Math.round(
        this.recipeService.recipeEditInProgess.revisions[
          this.revision
        ].materials.reduce((acc, material) => acc + material.Percentage, 0) *
          100
      ) / 100;
    this.remainingPercentage = Number.isNaN(100 - this.totalPercentage)
      ? 100
      : Math.abs(Math.round((100 - this.totalPercentage) * 100) / 100);
  }
}
