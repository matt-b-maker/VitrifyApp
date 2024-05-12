import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {
  Firestore,
  collectionData,
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  docData,
  query,
  where,
} from '@angular/fire/firestore';
import { Recipe } from '../Models/recipeModel';
import { UserMeta } from '../Models/userMetaModel';
import { AuthService } from './auth.service';
import { RecipesService } from './recipes.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore, private auth: AuthService, private recipesService: RecipesService) {}

  async create(collectionPath: string, documentId: string, data: any): Promise<void> {
    const docRef = doc(collection(this.firestore, collectionPath), documentId);
    await setDoc(docRef, data);
  }

  async upsert(collectionPath: string, id: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, id);
    await setDoc(docRef, data, { merge: true });
  }

  async getUser(collectionPath: string, id: string): Promise<UserMeta | undefined> {
    return firstValueFrom(docData(doc(this.firestore, collectionPath, id))) as unknown as UserMeta | undefined;
  }

  async getCollection(collectionPath: string, uid?: string): Promise<any> {
    if (uid) {
      // If uid is provided, return the specific document
      return firstValueFrom(
        docData(doc(this.firestore, `${collectionPath}/${uid}`))
      );
    } else {
      // If uid is not provided, return all documents in the collection
      return firstValueFrom(
        collectionData(collection(this.firestore, collectionPath))
      );
    }
  }

  async getDocumentsByUid(collectionPath: string, uid: string): Promise<any> {
    const q = query(
      collection(this.firestore, collectionPath),
      where('uid', '==', uid)
    );
    return firstValueFrom(collectionData(q));
  }

  async update(collectionPath: string, id: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, id);
    await updateDoc(docRef, data);
  }

  async delete(collectionPath: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, id);
    await deleteDoc(docRef);
  }

  //Recipes
  async saveRecipe(recipe: Recipe) {
    const data = {
      id: recipe.id || uuidv4(),
      name: recipe.name,
      description: recipe.description,
      creator: recipe.creator,
      uid: recipe.uid,
      cone: recipe.cone,
      firingType: recipe.firingType,
      notes: recipe.notes,
      dateCreated: new Date(),
      dateModified: new Date(),
      revisions: recipe.revisions.map((r) => ({
        revision: r.revision,
        status: r.status,
        notes: r.notes,
        ingredients: r.ingredients.map((ingredient) => ({
          name: ingredient.name,
          composition: {
            composition: ingredient.composition.composition,
            colorClass: ingredient.composition.colorClass,
          },
          type: ingredient.type,
          quantity: ingredient.quantity,
          percentage: ingredient.percentage,
          // imageUrl: ingredient.imageUrl, // Include imageUrl if needed
          listName: ingredient.listName,
        })),
      })),
    };
    await this.upsert('recipes', data.id, data);
  }

  //update recipe
  async updateRecipe(recipe: Recipe) {
    const data = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      creator: recipe.creator,
      uid: recipe.uid,
      cone: recipe.cone,
      firingType: recipe.firingType,
      notes: recipe.notes,
      dateCreated: recipe.dateCreated,
      dateModified: new Date(),
      revisions: recipe.revisions.map((r) => ({
        revision: r.revision,
        status: r.status,
        notes: r.notes,
        imageUrl: r.imageUrl || '', // Include imageUrl if needed
        ingredients: r.ingredients.map((ingredient) => ({
          name: ingredient.name,
          composition: {
            composition: ingredient.composition.composition,
            colorClass: ingredient.composition.colorClass,
          },
          type: ingredient.type,
          quantity: ingredient.quantity,
          percentage: ingredient.percentage,
          // imageUrl: ingredient.imageUrl, // Include imageUrl if needed
          listName: ingredient.listName,
        })),
      })),
      public: recipe.public || false,
    };
    await this.upsert('recipes', recipe.id, data);
  }

  //delete recipe
  async deleteRecipe(id: string) {
    await this.delete('recipes', id);
    this.recipesService.userRecipes = this.recipesService.userRecipes.filter(recipe => recipe.id !== id);
    this.auth.updateMeta(this.auth.userMeta!);
  }

  //get user recipes
  async getUserRecipes(uid: string): Promise<any> {
    return await this.getDocumentsByUid('recipes', uid);
  }

  //get all public and tested recipes
  async getPublicRecipes(): Promise<any> {
    const q = query(
      collection(this.firestore, 'recipes'),
      where('public', '==', true),
      where('tested', '==', true)
    );
    return await firstValueFrom(collectionData(q));
  }
}
function uuid4() {
  throw new Error('Function not implemented.');
}

