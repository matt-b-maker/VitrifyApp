import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { map, materialize } from 'rxjs/operators';
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
        imageUrls: r.imageUrls || ["data:image/jpeg;base64,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"], // Include imageUrl if needed
        materials: r.materials.map((material) => ({
          Name: material.Name,
          Quantity: material.Quantity || 0,
          Percentage: material.Percentage,
          // imageUrl: ingredient.imageUrl, // Include imageUrl if needed
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
        imageUrls: r.imageUrls || [], // Include imageUrl if needed
        materials: r.materials.map((material) => ({
          Name: material.Name,
          Quantity: material.Quantity,
          Percentage: material.Percentage,
          // imageUrl: ingredient.imageUrl, // Include imageUrl if needed
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
      where('uid', '!=', this.auth.userMeta?.uid),
      // where('public', '==', true),
      // where('tested', '==', true)
    );
    return await firstValueFrom(collectionData(q));
  }
}

function uuid4() {
  throw new Error('Function not implemented.');
}

