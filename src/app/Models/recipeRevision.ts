import { Ingredient } from "./ingredientModel";

export class RecipeRevision {
  revision: number = 0;
  ingredients: Ingredient[] = [];

  constructor(revision: number, ingredients: Ingredient[]) {
    this.revision = revision;
    this.ingredients = ingredients;
  }

  clear() {
    this.ingredients = [];
  }
}
