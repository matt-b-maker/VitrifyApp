import { Component, Inject, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { v4 as uuidv4 } from 'uuid';
import { DialogueService } from 'src/app/Services/dialogue-service.service';
import { AlertController, AnimationController, IonInput, LoadingController } from '@ionic/angular';
import { RecipesService } from 'src/app/Services/recipes.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { Router } from '@angular/router';
import { OpenAiService } from 'src/app/Services/open-ai.service';
import { FiringDetailsService } from 'src/app/Services/firing-details.service';
import { Status } from 'src/app/Models/status';
import { MaterialsService } from 'src/app/Services/materials.service';

@Component({
  selector: 'app-recipe-builder',
  templateUrl: './recipe-builder.page.html',
  styleUrls: [
    './recipe-builder.page.scss',
    '../../../ionic-selectable.component.scss',
  ],
})

export class RecipeBuilderPage {
  cone: string = '06';
  notes: string = '';
  firingTypes: string[] = this.firingDetailsService.firingTypes;
  firingType: string = 'Oxidation';
  cones: string[] = this.firingDetailsService.cones;
  remainingPercentageOver: boolean = false;
  coneRegex: RegExp = /^(0[1-9]|1[0-2]|[1-9])([-/](0[1-9]|1[0-2]|[1-9]))?$/;
  isEditing: boolean;
  //get all app-ingredient components
  @ViewChild('inputCone', { static: true }) inputCone!: IonInput;

  totalPercentage: number = 0;
  remainingPercentage: number = 100;

  // allMaterials: Ingredient[] = [
  //   ...this.ingredientService.allMaterials.sort((a, b) =>
  //     a.name.localeCompare(b.name)
  //   ),
  // ];

  allMaterials: any[] = this.materialsService.getMaterialsProperties();

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
    private materialsService: MaterialsService
  ) {
    this.calculateTotalPercentage();
    this.isEditing = this.recipeService.isEditing;
    this.allMaterials = this.allMaterials.sort((a, b) => a.name.localeCompare(b.name));
  }

  searchIngredients(event: any) {
    let search = event.text.toLowerCase();
    this.allMaterials = this.materialsService.getMaterialsProperties().filter(
      (material) =>
        material.name.toLowerCase().includes(search) ||
        material.chemicalComposition.toLowerCase().includes(search)
    );
  }

  setIngredientValue(event: any, index: number) {
    this.recipeService.recipeBuildInProgess.revisions[0].ingredients[index].name =
      event.value.name;
    this.recipeService.recipeBuildInProgess.revisions[0].ingredients[
      index
    ].composition.composition = event.value.chemicalComposition;
    this.updateMaterialsList();
  }

  updateMaterialsList() {
    //remove any materials that are already in the recipe
    this.allMaterials = this.ingredientService.allMaterials.filter(
      (material) =>
        !this.recipeService.recipeBuildInProgess.revisions[0].ingredients.find(
          (ingredient) => ingredient.name === material.name
        )
    );

    console.log(this.allMaterials);
    console.log(this.recipeService.recipeBuildInProgess.revisions[0].ingredients);
  }

  recipeComplete(): boolean {
    return (
      this.recipeService.recipeBuildInProgess.name.trim() !== '' &&
      this.recipeService.recipeBuildInProgess.description.trim() !== '' &&
      this.recipeService.recipeBuildInProgess.cone !== '' &&
      this.recipeService.recipeBuildInProgess.revisions[0].ingredients.length > 0
    );
  }

  async saveRecipeToFirestore() {
    let cancel = false;
    if (
      this.recipeService.userRecipes.find((recipe) => recipe.name.trim() === this.recipeService.recipeBuildInProgess.name.trim())
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
                (recipe) => recipe.name === this.recipeService.recipeBuildInProgess.name
              )?.id || uuidv4();
            //remove any ingredients that don't have a name
            this.recipeService.recipeBuildInProgess.revisions[0].ingredients = this.recipeService.recipeBuildInProgess.revisions[0].ingredients.filter(
              (ingredient) => ingredient.name !== ''
            );
            this.recipeService.recipeBuildInProgess.revisions[0].status = Status.New;
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
    this.recipeService.recipeBuildInProgess.revisions[0].ingredients = this.recipeService.recipeBuildInProgess.revisions[0].ingredients.filter(
      (ingredient) => ingredient.name !== ''
    );
    await this.firestoreService.saveRecipe(this.recipeService.recipeBuildInProgess);
    this.recipeService.userRecipes.push(this.recipeService.recipeBuildInProgess);
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
    this.recipeService.recipeBuildInProgess.name = this.recipeService.recipeBuildInProgess.name.trim();
  }

  //property methods
  setName(event: any) {
    this.name = event.target.value;
    this.recipeService.recipeBuildInProgess.name = event.target.value;
  }

  setCone(event: any) {
    this.cone = event.target.value;
    this.recipeService.recipeBuildInProgess.cone = event.target.value;
  }

  trimDescription() {
    this.recipeService.recipeBuildInProgess.description = this.recipeService.recipeBuildInProgess.description.trim();
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
      this.recipeService.recipeBuildInProgess.revisions[0].ingredients.length >= 5
    ) {
      await this.dialogueService
        .presentConfirmationDialog(
          'Wait a sec',
          `You really want more than ${this.recipeService.recipeBuildInProgess.revisions[0].ingredients.length} ingredients?`,
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

    this.recipeService.recipeBuildInProgess.revisions[0].ingredients.push(
      new Ingredient('', { composition: '', colorClass: '' }, '', 0, 1)
    );

    //Do animation stuff
    const newIngredientIndex =
      this.recipeService.recipeBuildInProgess.revisions[0].ingredients.length - 1;

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
      this.recipeService.recipeBuildInProgess.revisions[0].ingredients.length > 0
    );
  }

  setPercentage(event: any, index: number) {
    if (event.target.value === '') {
      this.recipeService.recipeBuildInProgess.revisions[0].ingredients[
        index
      ].percentage = 0;
      this.calculateTotalPercentage();
      return;
    }
    //check max length
    if (event.target.value.length > 5) {
      event.target.value = event.target.value.slice(0, 5);
      return;
    }
    this.recipeService.recipeBuildInProgess.revisions[0].ingredients[
      index
    ].percentage = parseFloat(event.target.value);
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
    this.recipeService.recipeBuildInProgess.revisions[0].ingredients.splice(
      index,
      1
    );
    this.updateMaterialsList();
    this.calculateTotalPercentage();
  }

  calculateTotalPercentage() {
    if (
      this.recipeService.recipeBuildInProgess.revisions[0].ingredients.length === 0
    ) {
      this.totalPercentage = 0;
      this.remainingPercentage = 100;
      return;
    }
    this.totalPercentage =
      Math.round(
        this.recipeService.recipeBuildInProgess.revisions[0].ingredients.reduce(
          (acc, ingredient) => acc + ingredient.percentage,
          0
        ) * 100
      ) / 100;
    this.remainingPercentage = Number.isNaN(100 - this.totalPercentage)
      ? 100
      : Math.round((100 - this.totalPercentage) * 100) / 100;
  }

  async aiGenerateRecipe() {
    let ingredients: Ingredient[] = [];

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

    this.recipeService.recipeBuildInProgess.revisions[0].ingredients = [];
    this.recipeService.recipeBuildInProgess.revisions[0].notes = '';
    this.recipeService.recipeBuildInProgess.revisions[0].imageUrl = '';
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
              "IngredientType": "Flux",
              "Percentage": 55.4
            },
            {
              "IngredientName": "Silica",
              "IngredientType": "Silica",
              "Percentage": 25.6
            },
            {
              "IngredientName": "EPK Kaolin",
              "IngredientType": "Stabilizer",
              "Percentage": 15.1
            },
            {
              "IngredientName": "Copper Carbonate",
              "IngredientType": "Colorant",
              "Percentage": 5.9
            }
          ],
          "notes": "This glaze formula creates a glossy finish suitable for cone 6 oxidation firing environments. Adjust the amount of Copper Carbonate to vary the color intensity."
        }
        Also, feel free to play with the percentages as floats and be as creative as you want!
        If you cannot make a glaze with the given information, please respond with "I cannot make a glaze with this information.".`
      );

      const responseJson = JSON.parse(newRecipeResponse); // Assuming the API response is in JSON string format

      console.log(newRecipeResponse);
      console.log(responseJson);

      if (responseJson.ingredients.length === 0) {
        await this.alertController
          .create({
            header: 'No Recipe Found',
            message: 'Sorry, I couldn\'t generate a recipe with the information you provided.',
            buttons: ['OK'],
          })
          .then((alert) => {
            alert.present();
          });
        loading.dismiss();
        return;
      }

      responseJson.ingredients.forEach((ingredient: { IngredientName: string; IngredientType: string; Percentage: number; }) => {
        let newIngredient = new Ingredient(
          ingredient.IngredientName,
          {
            composition: '',
            colorClass: '',
          },
          ingredient.IngredientType.toLowerCase(),
          0,
          ingredient.Percentage
        );
        this.recipeService.recipeBuildInProgess.revisions[0].ingredients.push(newIngredient);
      });

      this.recipeService.recipeBuildInProgess.revisions[0].notes = responseJson.notes;

      this.calculateTotalPercentage(); // Update the total percentage if needed
    } catch (error) {
      console.error('Error in aiGenerateRecipe:', error);
    }
    loading.dismiss();
  }
}
