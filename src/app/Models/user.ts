export class User {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  lastLogin: Date = new Date();
  displayName: string = '';
  constructor(email: string, lastLogin: Date, displayName: string) {
      this.email = email;
      this.lastLogin = lastLogin;
      this.displayName = displayName;
  }
}
