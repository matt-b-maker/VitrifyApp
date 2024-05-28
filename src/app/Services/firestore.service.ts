import { Injectable, input } from '@angular/core';
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
import { UserInventory } from '../Models/userInventoryModel';
import { TestBatch } from '../Models/testBatchModel';
import { FiringSchedule } from '../Models/firingScheduleModel';

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
        imageUrls: r.imageUrls || [], // Include imageUrl if needed
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

  async getUserInventory(uid: string): Promise<UserInventory> {
    let inventoryData: any = await this.getDocumentsByUid('inventory', uid);

    // Validate that the returned data matches the expected structure of UserInventory
    if (inventoryData && typeof inventoryData === 'object') {
      return inventoryData[0] as UserInventory;
    }

    // If the data is not valid, return a new UserInventory object
    const newInventory: UserInventory = {
      uid: uid,
      inventory: [],
    };
    return newInventory;
  }

  async getUserTestBatches(uid: string): Promise<any> {
    let testBatchesData: any = await this.getDocumentsByUid('testBatches', uid);

    // Validate that the returned data matches the expected structure of UserInventory
    if (testBatchesData && typeof testBatchesData === 'object' && testBatchesData.length > 0) {
      return testBatchesData;
    }

    // If the data is not valid, return a new UserInventory object
    const newTestBatches: TestBatch[] = [];
    return newTestBatches;
  }

  async upsertTestBatch(testBatch: TestBatch) {
    const data = {
      id: testBatch.id || uuidv4(),
      uid: testBatch.uid,
      name: testBatch.name,
      tiles: testBatch.tiles.map((tile) => ({
        number: tile.number,
        recipes: tile.recipes.map((recipe) => ({
          id: recipe.id,
          name: recipe.name,
          description: recipe.description,
          creator: recipe.creator,
          cone: recipe.cone,
          firingType: recipe.firingType,
          notes: recipe.notes,
          dateCreated: recipe.dateCreated === undefined ? '' : recipe.dateCreated,
          dateModified: recipe.dateModified === undefined ? '' : recipe.dateModified,
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
        })),
        selectedRevisions: tile.selectedRevisions,
        notes: tile.notes,
        inputTitleMode: tile.inputTitleMode,
      })),
      creator: this.auth.userMeta?.nickname || '',
      dateCreated: testBatch.dateCreated || new Date(),
      dateModified: new Date(),
      dateCompleted: testBatch.dateCompleted || null,
      descriptionString: testBatch.descriptionString,
      dateCreatedFormatted: testBatch.dateCreatedFormatted,
      dateCompletedFormatted: testBatch.dateCompletedFormatted,
      status: testBatch.status,
    };
    await this.upsert('testBatches', data.id, data);
  }

  async deleteTestBatch(id: string) {
    return await this.delete('testBatches', id);
  }

  async setUserInventory(uid: string, inventory: UserInventory) {
    const data = {
      uid: inventory.uid,
      inventory: inventory.inventory.map((item) => ({
        Name: item.Name,
        Oxides: item.Oxides.map((oxide) => ({
          OxideName: oxide.OxideName,
          Analysis: oxide.Analysis,
        })),
        OxidesWeight: item.OxidesWeight,
        Description: item.Description,
        Percentage: item.Percentage,
        Quantity: item.Quantity,
        Hazardous: item.Hazardous,
        Unit: item.Unit,
      }))
    };
    await this.upsert('inventory', uid, data);
  }

  async getUserFiringSchedules(uid: string): Promise<any> {
    let firingSchedulesData: any = await this.getDocumentsByUid('firingSchedules', uid);

    // Validate that the returned data matches the expected structure of UserInventory
    if (firingSchedulesData && typeof firingSchedulesData === 'object' && firingSchedulesData.length > 0) {
      return firingSchedulesData;
    }

    // If the data is not valid, return a new UserInventory object
    const newFiringSchedules: any = [];
    return newFiringSchedules;
  }

  async upsertFiringSchedule(firingSchedule: FiringSchedule) {
    const data = {
      id: firingSchedule.id || uuidv4(),
      uid: this.auth.userMeta?.uid || '',
      name: firingSchedule.name,
      description: firingSchedule.description,
      segments: firingSchedule.segments.map((segment) => ({
        lowTemp: segment.lowTemp,
        highTemp: segment.highTemp,
        duration: segment.duration,
        hold: segment.hold,
        type: segment.type,
      })),
      tempScale: firingSchedule.tempScale,
      maxTemp: firingSchedule.maxTemp,
      creator: this.auth.userMeta?.nickname || '',
      dateCreated: firingSchedule.dateCreated || new Date(),
      dateModified: new Date(),
    };
    await this.upsert('firingSchedules', data.id, data);
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

