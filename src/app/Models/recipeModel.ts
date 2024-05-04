import { Ingredient } from './ingredientModel';
import { RecipeRevision } from './recipeRevision';

export class Recipe {

  id: string = "";
  name: string = "";
  description: string = "";
  creator: string = "";
  userId: string = "";
  cone: string = '06';
  firingType: string = 'Oxidation';
  notes: string = "";
  revisions: RecipeRevision[] = [
    new RecipeRevision(1, [])
  ];

  constructor(id: string, name: string, description: string, creator: string, cone: string, revisions: RecipeRevision[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.cone = cone;
    this.revisions = revisions;
  }
}
