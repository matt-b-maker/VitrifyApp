import { Component, ViewChild, ViewChildren } from '@angular/core';
import { Ingredient } from 'src/app/Models/ingredientModel';
import { Recipe } from 'src/app/Models/recipeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { IngredientTypesService } from 'src/app/Services/ingredient-types.service';
import { v4 as uuidv4 } from 'uuid';
import { DialogueService } from 'src/app/Services/dialogue-service.service';
import { IngredientComponent } from 'src/app/Components/ingredient/ingredient.component';
import { AlertController, AnimationController, IonInput, LoadingController } from '@ionic/angular';
import { RecipesService } from 'src/app/Services/recipes.service';
import { GeminiService } from 'src/app/Services/gemini.service';

@Component({
  selector: 'app-recipe-builder',
  templateUrl: './recipe-builder.page.html',
  styleUrls: ['./recipe-builder.page.scss']
})
export class RecipeBuilderPage {
  cone: string = '06';
  notes: string = "";
  firingTypes: string[] = ['Oxidation', 'Reduction', 'Salt', 'Wood', 'Soda', 'Raku', 'Pit', 'Other'];
  firingType: string = 'Oxidation';
  cones: string[] = ['06', '5', '5/6', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  remainingPercentageOver: boolean = false;
  coneRegex: RegExp = /^(0[1-9]|1[0-2]|[1-9])([-/](0[1-9]|1[0-2]|[1-9]))?$/;
  //get all app-ingredient components
  @ViewChildren(IngredientComponent) ingredientComponents: any;
  @ViewChild('inputCone', {static: true}) inputCone!: IonInput;

  chipLabel: string = 'Remove things';
  removeIconsShowing: boolean = false;
  totalPercentage: number = 0;
  remainingPercentage: number = 100;

  silicas: string[] = Array.from(this.ingredientTypes.silicaMaterials);
  fluxes: string[] = Array.from(this.ingredientTypes.fluxMaterials);
  stabilizers: string[] = Array.from(this.ingredientTypes.stabilizerMaterials);
  colorants: string[] = Array.from(this.ingredientTypes.colorantMaterials);

  name: string = "";
  description: string = "";

  constructor(private auth: AuthService, private ingredientTypes: IngredientTypesService, private dialogueService: DialogueService, private animationCtrl: AnimationController,
    private alertController: AlertController, public recipeService: RecipesService, private geminiService: GeminiService, private loadingController: LoadingController)
  {
    this.silicas.sort();
    this.fluxes.sort();
    this.stabilizers.sort();
    this.colorants.sort();
    this.calculateTotalPercentage();
  }

  //animation methods
  async slideInNewIngredient(ingredientElement: HTMLElement) {
    const slideInAnimation = this.animationCtrl.create()
      .addElement(ingredientElement)
      .duration(100)
      .fromTo('transform', 'translateX(100%)', 'translateX(0)')
      .fromTo('opacity', '0', '1'); // Fade in effect

    await slideInAnimation.play();
  }

  async slideUpRemainingIngredients(ingredientElements: HTMLElement[], removedIndex: number) {
    if (ingredientElements.length === 0 || removedIndex < 0 || removedIndex >= ingredientElements.length) return;

    const slideUpAnimation = this.animationCtrl.create().duration(300); // Adjust duration as needed

    //slide up all elements after the one removed to fill the gap
    ingredientElements.forEach((element, index) => {
      if (index >= removedIndex) {
        slideUpAnimation.addElement(element).fromTo('transform', `translateY(${element.clientHeight}px)`, 'translateY(0)');
      }
    });

    await slideUpAnimation.play();
  }

  async slideOutIngredient(ingredientElement: HTMLElement) {
    const slideOutAnimation = this.animationCtrl.create()
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

  async addIngredient(type: string) {
    let cancel = false;
    let ingredientPlural: string;
    switch (type) {
      case 'Silica':
        ingredientPlural = 'silicas';
        break;
      case 'Flux':
        ingredientPlural = 'fluxes';
        break;
      case 'Stabilizer':
        ingredientPlural = 'stabilizers';
        break;
      case 'Colorant':
        ingredientPlural = 'colorants';
        break;
      default: ingredientPlural = 'ingredients';
    }

    let ingredientsByType = this.recipeService.recipeInProgess.revisions[0].ingredients.filter((ingredient) => ingredient.type === type);
    if (ingredientsByType.length >= 5) {
      await this.dialogueService.presentConfirmationDialog('Wait a sec', `You really want more than 5 ${ingredientPlural}?`, 'Yeah', 'No').then((result) => {
        if (result === false) {
          cancel = true;
        }
      });
    }

    if (cancel) return;

    this.recipeService.recipeInProgess.revisions[0].ingredients.push(new Ingredient(`Select a ${type}`, type, 0, 1));

    //Do animation stuff
    const newIngredientIndex = this.recipeService.recipeInProgess.revisions[0].ingredients.length - 1;
    this.chipLabel = 'Remove things';
    this.removeIconsShowing = false;

    // Get the last ingredient's HTML element and slide it in
    const ingredientElements = document.querySelectorAll('.w-fill-available');
    //get last element
    const newIngredientElement = ingredientElements[newIngredientIndex] as HTMLElement;
    await this.slideInNewIngredient(newIngredientElement);

    //update percentages
    this.calculateTotalPercentage();
  }

  anyIngredients() {
    return this.recipeService.recipeInProgess.revisions[0].ingredients.length > 0;
  }

  onPercentageValueChange(index: number, event: any) {
    this.recipeService.recipeInProgess.revisions[0].ingredients[index].percentage = Number.isNaN(parseFloat(event)) ? 0 : parseFloat(event);
    this.calculateTotalPercentage();
    this.remainingPercentageOver = this.remainingPercentage < 0;
  }

  async onRemoveIngredientEvent(event: any, index: number) {

    // Get the HTML element of the ingredient to be removed
    const ingredientElements = document.querySelectorAll('.ingredient');
    const ingredientElementToRemove = ingredientElements[index] as HTMLElement;

    //get elements after the one to be removed
    //const remainingIngredientElements: HTMLElement[] = Array.from(ingredientElements).slice(index + 1) as HTMLElement[];

    // Slide out the ingredient first, then remove it
    await this.slideOutIngredient(ingredientElementToRemove);
    this.recipeService.recipeInProgess.revisions[0].ingredients.splice(index, 1);
    this.updateIngredients();
    this.calculateTotalPercentage();
  }

  onNameValueChange(index: number, event: string) {
    this.recipeService.recipeInProgess.revisions[0].ingredients[index].name = event;
    this.updateIngredients();
  }

  calculateTotalPercentage() {
    if (this.recipeService.recipeInProgess.revisions[0].ingredients.length === 0) {
      this.totalPercentage = 0;
      this.remainingPercentage = 100;
      return;
    }
    this.totalPercentage = this.recipeService.recipeInProgess.revisions[0].ingredients.reduce((acc, ingredient) => acc + ingredient.percentage, 0);
    this.remainingPercentage = Number.isNaN(100 - this.totalPercentage) ? 100 : 100 - this.totalPercentage;
  }

  updateIngredients() {
    this.silicas = this.ingredientTypes.silicaMaterials.filter((silica) => !this.recipeService.recipeInProgess.revisions[0].ingredients.map((ingredient) => ingredient.name).includes(silica));
    this.silicas.sort();

    this.fluxes = this.ingredientTypes.fluxMaterials.filter((flux) => !this.recipeService.recipeInProgess.revisions[0].ingredients.map((ingredient) => ingredient.name).includes(flux));
    this.fluxes.sort();

    this.stabilizers = this.ingredientTypes.stabilizerMaterials.filter((stabilizer) => !this.recipeService.recipeInProgess.revisions[0].ingredients.map((ingredient) => ingredient.name).includes(stabilizer));
    this.stabilizers.sort();

    this.colorants = this.ingredientTypes.colorantMaterials.filter((colorant) => !this.recipeService.recipeInProgess.revisions[0].ingredients.map((ingredient) => ingredient.name).includes(colorant));
    this.colorants.sort();
  }

  showSilicaInfo() {
    this.alertController.create({
      header: 'Some Stuff About Silicas',
      message: 'Silica is a common ingredient in glazes. It is a glass former and is used to create a stable glaze. It is a refractory material and has a high melting point.',
      buttons: ['OK']
    }).then((alert) => {
      alert.present();
    })
  }

  showFluxInfo() {
    this.alertController.create({
      header: 'Some Stuff About Fluxes',
      message: 'Fluxes are used to lower the melting point of glazes. They are used to make glazes more fluid and to help them adhere to the clay body.',
      buttons: ['OK']
    }).then((alert) => {
      alert.present();
    })
  }

  showStabilizerInfo() {
    this.alertController.create({
      header: 'Some Stuff About Stabilizers',
      message: 'Stabilizers are used to help control the expansion and contraction of glazes. They are used to help prevent crazing and shivering.',
      buttons: ['OK']
    }).then((alert) => {
      alert.present();
    }
    )}

  showColorantInfo() {
    this.alertController.create({
      header: 'Some Stuff About Colorants',
      message: 'Colorants are used to add color to glazes. They are typically metal oxides and carbonates.',
      buttons: ['OK']
    }).then((alert) => {
      alert.present();
    })
  }

  async aiGenerateRecipe() {

    this.recipeService.recipeInProgess.revisions[0].clear();

    console.log(this.recipeService.recipeInProgess.cone, this.recipeService.recipeInProgess.description, this.recipeService.recipeInProgess.name)
    if (this.recipeService.recipeInProgess.name === "" || this.recipeService.recipeInProgess.description === "" || this.recipeService.recipeInProgess.cone === "") {
      await this.alertController.create({
        header: 'Missing Information',
        message: 'Please fill out all fields before generating a recipe.',
        buttons: ['OK']
      }).then((alert) => {
        alert.present();
      });
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Getting you that recipe...',
      spinner: 'bubbles',
      translucent: true,
    });

    loading.present();

    const newRecipe = await this.geminiService.runChat(
      `Create a glaze recipe for cone ${this.recipeService.recipeInProgess.cone} and firing type ${this.recipeService.recipeInProgess.firingType} with the following description: ${this.recipeService.recipeInProgess.description} and call it ${this.recipeService.recipeInProgess.name}.
      Leave out any non alphanumeric characters from your response and give it to me in list format, also specify the type of material each ingredient is between Silica, Flux, Stabilizer, and Colorant and the amount of each at the end of each list item. Any additional notes about the recipe should be preceded by "Notes:". Thanks!`
    );

    console.log(newRecipe);

    let recipeLines = newRecipe.split('\n').map(line => line.trim()).filter((line) => line !== '');
    recipeLines.forEach((line) => {
      line = line.replace('*', '').trim();
      if (line.includes('###')) return;
      if (line.startsWith('Notes:')) {
        this.recipeService.recipeInProgess.notes = line.replace('Notes:', '').trim();
      } else {
        let parts = line.split(/\s{1,2}/);
        //the last one is the percentage
        let percentage = parseFloat(parts[parts.length - 1]);

        //the second to last one is the type
        let type = parts[parts.length - 2];

        //everything else is the name
        let name = parts.slice(0, parts.length - 2).join(' ');

        let newIngredient = new Ingredient(name, type, 0, percentage);

        this.recipeService.recipeInProgess.revisions[0].ingredients.push(newIngredient);
      }
     });
    this.calculateTotalPercentage();
    loading.dismiss();
  }
}
