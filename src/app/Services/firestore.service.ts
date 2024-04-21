import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collectionData, doc, collection, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

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

  read(collectionPath: string): Observable<any> {
    return collectionData(collection(this.firestore, collectionPath), { idField: 'id' });
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
