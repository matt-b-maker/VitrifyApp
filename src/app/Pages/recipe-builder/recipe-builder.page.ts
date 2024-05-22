import {
  AfterViewInit,
  Component,
  Inject,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { v4 as uuidv4 } from 'uuid';
import { DialogueService } from 'src/app/Services/dialogue-service.service';
import {
  AlertController,
  AnimationController,
  IonInput,
  IonSearchbar,
  LoadingController,
} from '@ionic/angular';
import { RecipesService } from 'src/app/Services/recipes.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { Router } from '@angular/router';
import { OpenAiService } from 'src/app/Services/open-ai.service';
import { FiringDetailsService } from 'src/app/Services/firing-details.service';
import { Status } from 'src/app/Models/status';
import { MaterialsService } from 'src/app/Services/materials.service';
import { Material } from 'src/app/Interfaces/material';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ignoreElements } from 'rxjs';
import { MaterialsSelectComponent } from 'src/app/Components/materials-select/materials-select.component';

@Component({
  selector: 'app-recipe-builder',
  templateUrl: './recipe-builder.page.html',
  styleUrls: [
    './recipe-builder.page.scss',
    '../../../ionic-selectable.component.scss',
  ],
})
export class RecipeBuilderPage {
  searching: boolean = false;
  lowerCone: string = '6';
  upperCone: string = '10';
  isConeRange: boolean = false;
  notes: string = '';
  firingTypes: string[] = this.firingDetailsService.firingTypes;
  firingType: string = 'Oxidation';
  allCones: string[] = this.firingDetailsService.firingCones;
  conesLowerRange: string[] = [...this.allCones];
  conesUpperRange: string[] = [
    ...this.allCones.slice(0, this.allCones.indexOf(this.lowerCone)),
  ];
  lowerConeLabel: string = 'Cone';
  upperConeLabel: string = 'Max';
  remainingPercentageOver: boolean = false;
  coneRegex: RegExp = /^(0[1-9]|1[0-2]|[1-9])([-/](0[1-9]|1[0-2]|[1-9]))?$/;
  isEditing: boolean;
  //get all app-ingredient components
  @ViewChild('inputCone', { static: true }) inputCone!: IonInput;

  totalPercentage: number = 0;
  remainingPercentage: number = 100;

  allMaterials: Material[] = this.materialsService.materials.slice(0, 50);

  name: string = '';
  description: string = '';

  constructor(
    @Inject(IngredientTypesService)
    public ingredientService: IngredientTypesService,
    public recipeService: RecipesService,
    private auth: AuthService,
    private dialogueService: DialogueService,
    private animationCtrl: AnimationController,
    private alertController: AlertController,
    private openAiService: OpenAiService,
    private loadingController: LoadingController,
    private firestoreService: FirestoreService,
    private router: Router,
    private firingDetailsService: FiringDetailsService,
    private materialsService: MaterialsService,
    private renderer: Renderer2
  ) {
    this.calculateTotalPercentage();
    this.isEditing = this.recipeService.isEditing;
    this.allMaterials = this.allMaterials.sort((a, b) =>
      a.Name.localeCompare(b.Name)
    );
  }

  onSelectableClose(event: any) {
    this.searching = false;
    this.allMaterials = this.materialsService.materials.slice(0, 50);
  }

  setIngredientValue(event: any, index: number) {
    this.recipeService.recipeBuildInProgess.revisions[0].materials[
      index
    ].Name = event.Name;
    this.updateMaterialsList();
  }

  resetMaterials() {
    this.recipeService.recipeBuildInProgess.revisions[0].materials = [];
  }

  updateMaterialsList() {
    //remove any materials that are already in the recipe
    // this.allMaterials = this.ingredientService.allMaterials.filter(
    //   (material) =>
    //     !this.recipeService.recipeBuildInProgess.revisions[0].ingredients.find(
    //       (ingredient) => ingredient.name === material.name
    //     )
    // );
  }

  recipeComplete(): boolean {
    return (
      this.recipeService.recipeBuildInProgess.name.trim() !== '' &&
      this.recipeService.recipeBuildInProgess.description.trim() !== '' &&
      this.recipeService.recipeBuildInProgess.cone !== '' &&
      this.recipeService.recipeBuildInProgess.revisions[0].materials.length >
        0
    );
  }

  async saveRecipeToFirestore() {
    let cancel = false;
    if (
      this.recipeService.userRecipes.find(
        (recipe) =>
          recipe.name.trim() ===
          this.recipeService.recipeBuildInProgess.name.trim()
      )
    ) {
      await this.dialogueService
        .presentConfirmationDialog(
          'Recipe Exists',
          'You already have a recipe with that name. Overwrite?',
          'Yes',
          'No'
        )
        .then((result) => {
          if (result === false) {
            cancel = true;
          } else {
            this.recipeService.recipeBuildInProgess.id =
              this.recipeService.userRecipes.find(
                (recipe) =>
                  recipe.name === this.recipeService.recipeBuildInProgess.name
              )?.id || uuidv4();
            //remove any ingredients that don't have a name
            this.recipeService.recipeBuildInProgess.revisions[0].materials =
              this.recipeService.recipeBuildInProgess.revisions[0].materials.filter(
                (ingredient) => ingredient.Name !== ''
              );
            this.recipeService.recipeBuildInProgess.revisions[0].status =
              Status.New;
            this.firestoreService.saveRecipe(
              this.recipeService.recipeBuildInProgess
            );
          }
        });
    }
    if (cancel) return;
    this.recipeService.recipeBuildInProgess.creator =
      this.auth.user?.displayName || '';
    this.recipeService.recipeBuildInProgess.uid = this.auth.user?.uid || '';
    this.recipeService.recipeBuildInProgess.revisions[0].status = Status.New;
    this.recipeService.recipeBuildInProgess.revisions[0].materials =
      this.recipeService.recipeBuildInProgess.revisions[0].materials.filter(
        (material) => material.Name !== ''
      );
    debugger;
    await this.firestoreService.saveRecipe(
      this.recipeService.recipeBuildInProgess
    );
    this.recipeService.userRecipes.push(
      this.recipeService.recipeBuildInProgess
    );
    this.alertController
      .create({
        header: 'Recipe Saved',
        message: 'Done. Would you like to go to your recipes?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
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
  async slideInNewIngredient(): Promise<void> {
    const slideInAnimation = this.animationCtrl
      .create()
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
    this.recipeService.recipeBuildInProgess.name =
      this.recipeService.recipeBuildInProgess.name.trim();
  }

  //property methods
  setName(event: any) {
    this.name = event.target.value;
    this.recipeService.recipeBuildInProgess.name = event.target.value;
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

  toggleConeRange(event: any) {
    this.isConeRange = event.detail.checked;
    this.recipeService.recipeBuildInProgess.cone = this.isConeRange
      ? `${this.lowerCone}-${this.upperCone}`
      : this.lowerCone;
    this.lowerConeLabel = this.isConeRange ? 'Min' : 'Cone';
    this.conesLowerRange = this.isConeRange
      ? [
          ...this.allCones.slice(
            this.allCones.indexOf(this.upperCone) + 1,
            this.allCones.length
          ),
        ]
      : [...this.allCones];
  }

  setPublicProperty(event: any) {
    this.recipeService.recipeBuildInProgess.public = event.detail.checked;
  }

  trimDescription() {
    this.recipeService.recipeBuildInProgess.description =
      this.recipeService.recipeBuildInProgess.description.trim();
  }

  setDescription(event: any) {
    this.description = event.target.value;
    this.recipeService.recipeBuildInProgess.description = event.target.value;
  }

  setNotes(event: any) {
    this.notes = event.target.value;
    this.recipeService.recipeBuildInProgess.notes = event.target.value;
  }

  async addIngredient() {
    let cancel = false;
    if (
      this.recipeService.recipeBuildInProgess.revisions[0].materials.length >=
      5
    ) {
      await this.dialogueService
        .presentConfirmationDialog(
          'Wait a sec',
          `You really want more than ${this.recipeService.recipeBuildInProgess.revisions[0].materials.length} ingredients?`,
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

    this.recipeService.recipeBuildInProgess.revisions[0].materials.push(
      { Name: '', Oxides: [], OxidesWeight: 0, Description: '', Percentage: 0, Quantity: 0, Hazardous: false, Unit: 'g'}
    );

    //update percentages
    this.calculateTotalPercentage();

    //do the animation
    await this.slideInNewIngredient().then(() => {
      // Get the last ingredient's HTML element and slide it in
      let materialElements = document.querySelectorAll(
        '.material-ingredient'
      );
      let lastIngredientElement = materialElements[
        materialElements.length - 1
      ] as HTMLElement;
      lastIngredientElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }

  anyIngredients() {
    return (
      this.recipeService.recipeBuildInProgess.revisions[0].materials.length >
      0
    );
  }

  setPercentage(event: any, index: number) {
    if (
      event.target.value === '0' ||
      event.target.value === '' ||
      !event.target.value
    ) {
      this.recipeService.recipeBuildInProgess.revisions[0].materials[
        index
      ].Percentage = 1;
      this.calculateTotalPercentage();
      return;
    }

    //check max length
    if (event.target.value.length > 5) {
      event.target.value = event.target.value.slice(0, 5);
      this.recipeService.recipeBuildInProgess.revisions[0].materials[
        index
      ].Percentage = parseFloat(
        this.trimLeadingZeros(event.target.value).slice(0, 5)
      );
      return;
    }
    this.recipeService.recipeBuildInProgess.revisions[0].materials[
      index
    ].Percentage = parseFloat(this.trimLeadingZeros(event.target.value));
    this.calculateTotalPercentage();
  }

  trimLeadingZeros(input: string): string {
    if (input) {
      return input.replace(/^0+/, '');
    }
    return '';
  }

  async removeIngredient(index: number) {
    // Get the HTML element of the ingredient to be removed
    const ingredientElements = document.querySelectorAll('.ingredient');
    const ingredientElementToRemove = ingredientElements[index] as HTMLElement;

    //get elements after the one to be removed
    //const remainingIngredientElements: HTMLElement[] = Array.from(ingredientElements).slice(index + 1) as HTMLElement[];

    // Slide out the ingredient first, then remove it
    await this.slideOutIngredient(ingredientElementToRemove);
    this.updateMaterialsList();
    this.calculateTotalPercentage();
  }

  calculateTotalPercentage() {
    if (
      this.recipeService.recipeBuildInProgess.revisions[0].materials
        .length === 0
    ) {
      this.totalPercentage = 0;
      this.remainingPercentage = 100;
      return;
    }
    this.totalPercentage =
      Math.round(
        this.recipeService.recipeBuildInProgess.revisions[0].materials.reduce(
          (acc, material) => acc + material.Percentage,
          0
        ) * 100
      ) / 100;
    this.remainingPercentage = Number.isNaN(100 - this.totalPercentage)
      ? 100
      : Math.round((100 - this.totalPercentage) * 100) / 100;
  }

  async aiGenerateRecipe() {
    let materials: Material[] = [];

    if (
      this.recipeService.recipeBuildInProgess.name === '' ||
      this.recipeService.recipeBuildInProgess.description === '' ||
      this.recipeService.recipeBuildInProgess.cone === ''
    ) {
      await this.alertController
        .create({
          header: 'Missing Information',
          message: 'Please fill out all fields before generating a recipe.',
          buttons: ['OK'],
        })
        .then((alert) => {
          alert.present();
        });
      return;
    }

    this.recipeService.recipeBuildInProgess.revisions[0].materials = [];
    this.recipeService.recipeBuildInProgess.revisions[0].notes = '';
    this.recipeService.recipeBuildInProgess.revisions[0].imageUrls = [];
    this.recipeService.recipeBuildInProgess.revisions[0].status = Status.New;

    const loading = await this.loadingController.create({
      message: 'Getting you that recipe...',
      spinner: 'bubbles',
      translucent: true,
    });

    loading.present();

    try {
      const newRecipeResponse: string = await this.openAiService.getCompletion(
        `Glaze recipe, cone: ${this.recipeService.recipeBuildInProgess.cone}, firing type: ${this.recipeService.recipeBuildInProgess.firingType} and description: ${this.recipeService.recipeBuildInProgess.description}.
        Your response should be formatted as json with the list of ingredients and notes. Here's an example response:
        {
          "ingredients": [
            {
              "IngredientName": "Nepheline Syenite",
              "Percentage": 55.4
            },
            {
              "IngredientName": "Silica",
              "Percentage": 25.6
            },
            {
              "IngredientName": "EPK Kaolin",
              "Percentage": 15.1
            },
            {
              "IngredientName": "Copper Carbonate",
              "Percentage": 5.9
            }
          ],
          "notes": "This glaze formula creates a glossy finish suitable for cone 6 oxidation firing environments. Adjust the amount of Copper Carbonate to vary the color intensity."
        }
        Please use any ingredients that are available on digitalfire.com, as that's where I get my data.
        Also, feel free to play with the percentages as floats and be as creative as you want!
        If you cannot make a glaze with the given information, please respond with "I cannot make a glaze with this information.".`
      );

      const responseJson = JSON.parse(newRecipeResponse);
      if (responseJson.ingredients.length === 0) {
        await this.alertController
          .create({
            header: 'No Recipe Found',
            message:
              "Sorry, I couldn't generate a recipe with the information you provided.",
            buttons: ['OK'],
          })
          .then((alert) => {
            alert.present();
          });
        loading.dismiss();
        return;
      }

      responseJson.ingredients.forEach(
        (ingredient: {
          IngredientName: string;
          Percentage: number;
        }) => {
          let newMaterial: Material | undefined = this.materialsService.materials.find(
            (material) => material.Name.includes(ingredient.IngredientName)
          );
          if (newMaterial) {
            newMaterial.Percentage = ingredient.Percentage;
            newMaterial.Quantity = 0;
            this.recipeService.recipeBuildInProgess.revisions[0].materials.push(
              newMaterial
            );
          }
        }
      );

      this.recipeService.recipeBuildInProgess.revisions[0].notes =
        responseJson.notes;

      this.calculateTotalPercentage(); // Update the total percentage if needed
    } catch (error) {
      console.error('Error in aiGenerateRecipe:', error);
    }
    loading.dismiss();
  }
}
