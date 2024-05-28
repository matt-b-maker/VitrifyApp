import { Ingredient } from './ingredientModel';
import { RecipeRevision } from './recipeRevision';
import { Comment } from './commentModel';

export class Recipe {

  id: string = "";
  name: string = "";
  description: string = "";
  creator: string = "";
  uid: string = "";
  cone: string = '06';
  firingType: string = 'Oxidation';
  notes: string = "";
  dateCreated!: Date;
  dateModified!: Date;
  revisions: RecipeRevision[] = [
    new RecipeRevision(1, [])
  ];
  public: boolean = true;
  likes: number = 0;
  comments: Comment[] = [];

  constructor(id: string, name: string, description: string, creator: string, cone: string, revisions: RecipeRevision[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.creator = creator;
    this.cone = cone;
    this.revisions = revisions;
  }
}
