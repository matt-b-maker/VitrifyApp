import {Material} from '../Interfaces/material';

export class UserInventory {
  uid: string;
  inventory: Material[] = [];

  constructor(uid: string) {
    this.uid = uid;
  }
}
