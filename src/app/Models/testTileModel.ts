import { Recipe } from "./recipeModel";

export class TestTile {

  number: number | string = 1;
  recipes: Recipe[] = [];
  selectedRevisions: number[] = [];
  notes: string = "";
  inputTitleMode: boolean = false;

  constructor(number: number, recipes: Recipe[], notes: string) {
    this.recipes = recipes;
    this.number = number;
    this.notes = notes;
  }
}
