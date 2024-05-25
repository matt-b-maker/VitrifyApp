import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { TestBatch } from '../Models/testBatchModel';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  testBatches: TestBatch[] = [];

  constructor(private firestore: FirestoreService, private auth: AuthService) {
  }

  async getUserTestBatches() {
    await this.firestore.getUserTestBatches(this.auth.user?.uid || '').then((testBatches) => {
      this.testBatches = testBatches;
    });
  }
}
