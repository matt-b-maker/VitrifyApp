import { Ingredient } from './ingredientModel';

export class Recipe {

  id: string = "";
  name: string = "";
  description: string = "";
  creator: string = "";
  cone: number = 0;
  silicas: Ingredient[] = [];
  fluxes: Ingredient[] = [];
  stabilizers: Ingredient[] = [];
  colorants: Ingredient[] = [];

  constructor(id: string, name: string, description: string, creator: string, cone: number, Silicas: Ingredient[], Fluxes: Ingredient[], Stabilizers: Ingredient[], Colorants: Ingredient[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.cone = cone;
    this.silicas = Silicas;
    this.fluxes = Fluxes;
    this.stabilizers = Stabilizers;
    this.colorants = Colorants;
  }
}
