import {
  Component,
  Inject,
  ViewChild,
  ViewChildren,
  QueryList,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { Recipe } from 'src/app/Models/recipeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { v4 as uuidv4 } from 'uuid';
import { DialogueService } from 'src/app/Services/dialogue-service.service';
import { IngredientComponent } from 'src/app/Components/ingredient/ingredient.component';
import {
  AlertController,
  AnimationController,
  IonInput,
  LoadingController,
} from '@ionic/angular';
import { RecipesService } from 'src/app/Services/recipes.service';
import { GeminiService } from 'src/app/Services/gemini.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { Router } from '@angular/router';

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
  firingTypes: string[] = [
    'Oxidation',
    'Reduction',
    'Salt',
    'Wood',
    'Soda',
    'Raku',
    'Pit',
    'Other',
  ];
  firingType: string = 'Oxidation';
  cones: string[] = [
    '06',
    '5',
    '5/6',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
  ];
  remainingPercentageOver: boolean = false;
  coneRegex: RegExp = /^(0[1-9]|1[0-2]|[1-9])([-/](0[1-9]|1[0-2]|[1-9]))?$/;
  //get all app-ingredient components
  @ViewChild('inputCone', { static: true }) inputCone!: IonInput;

  totalPercentage: number = 0;
  remainingPercentage: number = 100;

  allMaterials: Ingredient[] = [...this.ingredientService.allMaterials.sort((a, b) =>
    a.name.localeCompare(b.name)
  )];

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
    private geminiService: GeminiService,
    private loadingController: LoadingController,
    private firestoreService: FirestoreService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.calculateTotalPercentage();
    this.recipeService.recipeInProgess.revisions[0].ingredients.push(this.allMaterials[0]);
  }

  searchIngredients(event: any) {
    let search = event.text.toLowerCase();
    this.allMaterials = this.ingredientService.allMaterials.filter((material) =>
      material.name.toLowerCase().includes(search)
    );
  }

  setIngredientValue(event: any, index: number) {
    this.recipeService.recipeInProgess.revisions[0].ingredients[index].name =
      event.value.name;
    this.recipeService.recipeInProgess.revisions[0].ingredients[index].type = event.value.type;
    this.recipeService.recipeInProgess.revisions[0].ingredients[index].composition.composition = event.value.composition.composition;
    this.recipeService.recipeInProgess.revisions[0].ingredients[index].composition.colorClass = event.value.composition.colorClass;
    this.updateMaterialsList();
  }

  updateMaterialsList() {
    //remove any materials that are already in the recipe
    this.allMaterials = this.ingredientService.allMaterials.filter(
      (material) =>
        !this.recipeService.recipeInProgess.revisions[0].ingredients.find(
          (ingredient) => ingredient.name === material.name
        )
    );

    console.log(this.allMaterials);
    console.log(this.recipeService.recipeInProgess.revisions[0].ingredients);
  }

  recipeComplete(): boolean {
    return (
      this.recipeService.recipeInProgess.name !== '' &&
      this.recipeService.recipeInProgess.description !== '' &&
      this.recipeService.recipeInProgess.cone !== '' &&
      this.recipeService.recipeInProgess.revisions[0].ingredients.length > 0
    );
  }

  async saveRecipeToFirestore() {
    let cancel = false;
    if (
      this.recipeService.recipes.find((recipe) => recipe.name === this.name)
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
            this.recipeService.recipeInProgess.id =
              this.recipeService.recipes.find(
                (recipe) => recipe.name === this.name
              )?.id || uuidv4();
            this.firestoreService.saveRecipe(
              this.recipeService.recipeInProgess
            );
          }
        });
    }
    if (cancel) return;
    this.recipeService.recipeInProgess.creator =
      this.auth.user?.displayName || '';
    this.recipeService.recipeInProgess.uid = this.auth.user?.uid || '';
    await this.firestoreService.saveRecipe(this.recipeService.recipeInProgess);
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
              this.recipeService.recipes.push(this.recipeService.recipeInProgess);
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

  //property methods
  setName(event: any) {
    this.name = event.target.value;
    this.recipeService.recipeInProgess.name = event.target.value;
  }

  setCone(event: any) {
    this.cone = event.target.value;
    this.recipeService.recipeInProgess.cone = event.target.value;
  }

  setDescription(event: any) {
    this.description = event.target.value;
    this.recipeService.recipeInProgess.description = event.target.value;
  }

  setNotes(event: any) {
    this.notes = event.target.value;
    this.recipeService.recipeInProgess.notes = event.target.value;
  }

  async addIngredient() {
    let cancel = false;
    if (
      this.recipeService.recipeInProgess.revisions[0].ingredients.length >= 5
    ) {
      await this.dialogueService
        .presentConfirmationDialog(
          'Wait a sec',
          `You really want more than ${this.recipeService.recipeInProgess.revisions[0].ingredients.length} ingredients?`,
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

    this.recipeService.recipeInProgess.revisions[0].ingredients.push(
      new Ingredient(
        '',
        { composition: '', colorClass: '' },
        '',
        0,
        1
      )
    );

    //Do animation stuff
    const newIngredientIndex =
      this.recipeService.recipeInProgess.revisions[0].ingredients.length - 1;

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
      this.recipeService.recipeInProgess.revisions[0].ingredients.length > 0
    );
  }

  // setMaterialName(event: any, index: number) {
  //   console.log(event.value.name);
  //   this.recipeService.recipeInProgess.revisions[0].ingredients[
  //     index
  //   ].name = event.value.name;
  //   this.updateMaterialsList();
  // }

  setPercentage(event: any, index: number) {
    if (event.target.value === '') {
      this.recipeService.recipeInProgess.revisions[0].ingredients[
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
    this.recipeService.recipeInProgess.revisions[0].ingredients[
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
    this.recipeService.recipeInProgess.revisions[0].ingredients.splice(
      index,
      1
    );
    this.updateMaterialsList();
    this.calculateTotalPercentage();
  }

  calculateTotalPercentage() {
    if (
      this.recipeService.recipeInProgess.revisions[0].ingredients.length === 0
    ) {
      this.totalPercentage = 0;
      this.remainingPercentage = 100;
      return;
    }
    this.totalPercentage =
      Math.round(
        this.recipeService.recipeInProgess.revisions[0].ingredients.reduce(
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
      this.recipeService.recipeInProgess.name === '' ||
      this.recipeService.recipeInProgess.description === '' ||
      this.recipeService.recipeInProgess.cone === ''
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

    this.recipeService.recipeInProgess.revisions[0].clear();

    const loading = await this.loadingController.create({
      message: 'Getting you that recipe...',
      spinner: 'bubbles',
      translucent: true,
    });

    loading.present();

    try {
      const newRecipeResponse = await this.geminiService.runChat(
        `Glaze recipe for cone ${this.recipeService.recipeInProgess.cone}, firing type ${this.recipeService.recipeInProgess.firingType} and deccription ${this.recipeService.recipeInProgess.description}.
        Put it in a list format like this: IngredientName Type Percentage (e.g. Red Iron Oxide Colorant 3.1). My types are Silica, Flux, Stabilizer, and Colorant.
        Include only one note at the end of the list like this: Notes: [Your notes here]. No non alpha numeric characters in your response please. This is for an automation, so it's important that your response is formatted correctly. Thank you, you're the best`
      );

      console.log(newRecipeResponse);

      let recipeLines = newRecipeResponse
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '');
      recipeLines.forEach((line) => {
        line = line.replace('*', '').trim();
        if (line.includes('#') || line.toUpperCase().includes('INGREDIENT') || line.toUpperCase().includes('INGREDIENTNAME') || line.includes('-'))
          return;
        if (line.startsWith('Notes:')) {
          this.recipeService.recipeInProgess.notes = line
            .replace('Notes:', '')
            .trim();
        } else {
          let parts = line.split(/\s{1,2}/);

          //the last one is the percentage
          let percentage = parseFloat(parts[parts.length - 1]);

          //the second to last one is the type
          let type = parts[parts.length - 2];

          //everything else is the name
          let name = parts.slice(0, parts.length - 2).join(' ');

          let matchingIngredient = this.allMaterials.find((material) =>
            material.name == name
          );

          let newIngredient = new Ingredient(
            matchingIngredient?.name || name,
            { composition: matchingIngredient?.composition.composition || '', colorClass: '' },
            type.toLowerCase(),
            0,
            percentage
          );

          ingredients.push(newIngredient);
        }
      });
      this.recipeService.recipeInProgess.revisions[0].ingredients = ingredients;
      this.calculateTotalPercentage();
    }
    catch (error) {
      console.error('Error in aiGenerateRecipe:', error);
    }
    loading.dismiss();
  }
}
