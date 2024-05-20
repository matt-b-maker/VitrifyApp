// Remove the import statement for User from '@angular/fire/auth'

import { Recipe } from './recipeModel';

export class UserMeta {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  lastLogin: Date = new Date();
  displayName: string = '';
  photoUrl: string = '';
  isPremium: boolean = false;
  uid: string = '';
  nickname: string = '';

  constructor(firstName:string, lastName: string, email: string, displayName: string, photoUrl: string, recipes: Recipe[], uid: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.displayName = displayName;
    this.photoUrl = photoUrl;
    this.uid = uid;
  }
}
