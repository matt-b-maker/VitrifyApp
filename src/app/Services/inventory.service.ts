import { Injectable, OnInit } from '@angular/core';
import { UserInventory } from '../Models/userInventoryModel';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  userInventory!: UserInventory;

  constructor(private authService: AuthService, private firestore: FirestoreService) {
  }

  async getUserInventory() {
    this.userInventory = await this.firestore.getUserInventory(this.authService.userMeta?.uid || '');
  }
}
