import { Component, Inject, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { DialogueService } from 'src/app/Services/dialogue-service.service';
import { AlertController, AnimationController, IonInput, LoadingController } from '@ionic/angular';
import { RecipesService } from 'src/app/Services/recipes.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { Router } from '@angular/router';
import { FiringDetailsService } from 'src/app/Services/firing-details.service';
import { Status } from 'src/app/Models/status';

@Component({
  selector: 'app-recipe-editor',
  templateUrl: './recipe-editor.page.html',
  styleUrls: [
    './recipe-editor.page.scss',
    '../../../ionic-selectable.component.scss',
  ],
})

export class RecipeEditorPage {
  cone: string = '06';
  notes: string = '';
  firingTypes: string[] = this.firingDetailsService.firingTypes;
  firingType: string = 'Oxidation';
  cones: string[] = this.firingDetailsService.cones;
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

  name: string = '';
  description: string = '';
  revision: number = 0;
  statuses: string[] = [
    Status.New,
    Status.InProgress,
    Status.Tested,
    Status.Archived,
  ];

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
    private firingDetailsService: FiringDetailsService
  ) {
    this.calculateTotalPercentage();
    this.isEditing = this.recipeService.isEditing;
    this.revision = this.recipeService.editingRevision;

    //create new variables for materials descending and ascending
    let materialsDescending = [...this.allMaterials].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    let materialsAscending = [...this.allMaterials].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
    console.log(materialsDescending);
    console.log(materialsAscending);
  }

  searchIngredients(event: any) {
    let search = event.text.toLowerCase();
    this.allMaterials = this.ingredientService.allMaterials.filter((material) =>
      material.name.toLowerCase().includes(search)
    );
  }

  setStatus(event: any) {
    this.recipeService.recipeEditInProgess.revisions[this.revision].status = event.detail.value;
  }

  setIngredientValue(event: any, index: number) {
    this.recipeService.recipeEditInProgess.revisions[0].ingredients[index].name =
      event.value.name;
    this.recipeService.recipeEditInProgess.revisions[0].ingredients[index].type =
      event.value.type;
    this.recipeService.recipeEditInProgess.revisions[0].ingredients[
      index
    ].composition.composition = event.value.composition.composition;
    this.recipeService.recipeEditInProgess.revisions[0].ingredients[
      index
    ].composition.colorClass = event.value.composition.colorClass;
    this.updateMaterialsList();
  }

  updateMaterialsList() {
    //remove any materials that are already in the recipe
    this.allMaterials = this.ingredientService.allMaterials.filter(
      (material) =>
        !this.recipeService.recipeEditInProgess.revisions[0].ingredients.find(
          (ingredient) => ingredient.name === material.name
        )
    );

    console.log(this.allMaterials);
    console.log(this.recipeService.recipeEditInProgess.revisions[0].ingredients);
  }

  recipeComplete(): boolean {
    return (
      this.recipeService.recipeEditInProgess.name.trim() !== '' &&
      this.recipeService.recipeEditInProgess.description.trim() !== '' &&
      this.recipeService.recipeEditInProgess.cone !== '' &&
      this.recipeService.recipeEditInProgess.revisions[0].ingredients.length > 0
    );
  }

  async saveRecipeToFirestore() {
    if (this.recipeService.recipeEditInProgess.uid !== this.auth.user?.uid) this.recipeService.recipeEditInProgess.uid = this.auth.user?.uid || '';
    await this.firestoreService.saveRecipe(this.recipeService.recipeEditInProgess);
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
    this.recipeService.recipeEditInProgess.name = this.recipeService.recipeEditInProgess.name.trim();
  }

  //property methods
  setName(event: any) {
    this.name = event.target.value;
    this.recipeService.recipeEditInProgess.name = event.target.value;
  }

  setCone(event: any) {
    this.cone = event.target.value;
    this.recipeService.recipeEditInProgess.cone = event.target.value;
  }

  trimDescription() {
    this.recipeService.recipeEditInProgess.description = this.recipeService.recipeEditInProgess.description.trim();
  }

  setDescription(event: any) {
    this.description = event.target.value;
    this.recipeService.recipeEditInProgess.description = event.target.value;
  }

  setNotes(event: any) {
    this.notes = event.target.value;
    this.recipeService.recipeEditInProgess.notes = event.target.value;
  }

  async addIngredient() {
    let cancel = false;
    if (
      this.recipeService.recipeEditInProgess.revisions[0].ingredients.length >= 5
    ) {
      await this.dialogueService
        .presentConfirmationDialog(
          'Wait a sec',
          `You really want more than ${this.recipeService.recipeEditInProgess.revisions[0].ingredients.length} ingredients?`,
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

    this.recipeService.recipeEditInProgess.revisions[0].ingredients.push(
      new Ingredient('', { composition: '', colorClass: '' }, '', 0, 1)
    );

    //Do animation stuff
    const newIngredientIndex =
      this.recipeService.recipeEditInProgess.revisions[0].ingredients.length - 1;

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
      this.recipeService.recipeEditInProgess.revisions[0].ingredients.length > 0
    );
  }

  setPercentage(event: any, index: number) {
    if (event.target.value === '') {
      this.recipeService.recipeEditInProgess.revisions[0].ingredients[
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
    this.recipeService.recipeEditInProgess.revisions[0].ingredients[
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
    this.recipeService.recipeEditInProgess.revisions[0].ingredients.splice(
      index,
      1
    );
    this.updateMaterialsList();
    this.calculateTotalPercentage();
  }

  calculateTotalPercentage() {
    if (
      this.recipeService.recipeEditInProgess.revisions[0].ingredients.length === 0
    ) {
      this.totalPercentage = 0;
      this.remainingPercentage = 100;
      return;
    }
    this.totalPercentage =
      Math.round(
        this.recipeService.recipeEditInProgess.revisions[0].ingredients.reduce(
          (acc, ingredient) => acc + ingredient.percentage,
          0
        ) * 100
      ) / 100;
    this.remainingPercentage = Number.isNaN(100 - this.totalPercentage)
      ? 100
      : Math.round((100 - this.totalPercentage) * 100) / 100;
  }
}
