import { Material } from "../Interfaces/material";
import { Ingredient } from "./ingredientModel";
import { Status } from "./status";

export class RecipeRevision {
  revision: number = 0;
  imageUrls: string[] = [];
  materials: Material[] = [];
  notes: string = "";
  status: Status = Status.New;
  dateCreated: Date = new Date();
  dateModified: Date = new Date();

  constructor(revision: number, materials: Material[]) {
    this.revision = revision;
    this.materials = materials;
  }
}
