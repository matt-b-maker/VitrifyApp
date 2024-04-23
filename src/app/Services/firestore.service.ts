import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collectionData, doc, collection, setDoc, updateDoc, deleteDoc, docData, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) { }

  async create(collectionPath: string, data: any): Promise<void> {
    const docRef = doc(collection(this.firestore, collectionPath));
    await setDoc(docRef, data);
  }

  async upsert(collectionPath: string, id: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, id);
    await setDoc(docRef, data, { merge: true });
  }

  async getUser(collectionPath: string, id: string): Promise<any> {
    return firstValueFrom(docData(doc(this.firestore, collectionPath, id)));
  }

  async getCollection(collectionPath: string, uid?: string): Promise<any> {
    if (uid) {
      // If uid is provided, return the specific document
      return firstValueFrom(docData(doc(this.firestore, `${collectionPath}/${uid}`)));
    } else {
      // If uid is not provided, return all documents in the collection
      return firstValueFrom(collectionData(collection(this.firestore, collectionPath)));
    }
  }

  async getDocumentsByUid(collectionPath: string, uid: string): Promise<any> {
    const q = query(collection(this.firestore, collectionPath), where('uid', '==', uid));
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
}
