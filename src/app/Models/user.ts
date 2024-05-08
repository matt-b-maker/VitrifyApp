// Remove the import statement for User from '@angular/fire/auth'

export class UserMeta {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  lastLogin: Date = new Date();
  displayName: string = '';
  photoUrl: string = '';
  isPremium: boolean = false;
  constructor(email: string, lastLogin: Date, displayName: string) {
      this.email = email;
      this.lastLogin = lastLogin;
      this.displayName = displayName;
  }
}
