import { Ingredient } from "./ingredientModel";
import { Status } from "./status";

export class RecipeRevision {
  revision: number = 0;
  imageUrl: string = "";
  ingredients: Ingredient[] = [];
  notes: string = "";
  status: Status = Status.New;
  dateCreated: Date = new Date();
  dateModified: Date = new Date();

  constructor(revision: number, ingredients: Ingredient[]) {
    this.revision = revision;
    this.ingredients = ingredients;
  }
}
