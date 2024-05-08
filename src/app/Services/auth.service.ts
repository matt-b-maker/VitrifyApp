import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { signInWithCredential } from 'firebase/auth';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();
  public loggedIn: boolean = false;
  errorMessage: string = '';
  public user: User | null = null;

  constructor(private auth: Auth, private gPlus: GooglePlus, private afAuth: AngularFireModule, private platform: Platform, private alertController: AlertController) {
    let user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userSubject.next(this.user);
    }
    else {
      this.auth.onAuthStateChanged(user => {
        this.userSubject.next(user);
      });
    }
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    this.removeAuthData();
    this.user = null;
    this.userSubject.next(null);
    if (this.platform.is('cordova')) {
      return await this.gPlus.logout();
    }
    return await signOut(this.auth);
  }

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {
    if (this.platform.is('cordova')) {
      return await this.nativeGoogleLogin();
    } else {
      return await this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin() {
    try {
      const gPlusUser = await this.gPlus.login({
        'webClientId': '478684273334-cupehva2rmu8ce5h0ibti3fmrjgr659j.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });
      const googleCredential = GoogleAuthProvider.credential(gPlusUser.idToken);
      return await signInWithCredential(this.auth, googleCredential);
    }
    catch (error: any) {
      this.errorMessage = error.message;
      return null;
    }
  }

  async webGoogleLogin(){
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error; // Re-throw the error to handle it in the calling code if needed
    }
  }

  getUser(){
    return this.auth.currentUser;
  }

  updateUser(user: User){
    this.userSubject.next(user);
    this.user = user;
  }

  isLoggedIn(){
    return this.user != null;
  }

  resetPassword(email: string){
    return sendPasswordResetEmail(this.auth, email);
  }

  get userIsAuthenticated() {
    console.log(this.userSubject)
    if (!this.userSubject) {
      return of(false);
    }
    return this.userSubject.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.refreshToken;
        } else {
          return false;
        }
      })
    );
  }

  userAuthenticated(): boolean {
    if (this.user) {
      return !!this.user.refreshToken;
    } else {
      return false;
    }
  }


  storeAuthData(user: User){
    console.log(user);
    //store based on platform
    if (this.platform.is('cordova')) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  removeAuthData(){
    localStorage.removeItem('user');
  }

  autoLogin(): Observable<boolean> {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      console.log('no user');
      return of(false); // No user data in localStorage
    }

    const userData = JSON.parse(userDataString);
    // Check if token is still valid
    if (userData.stsTokenManager && userData.stsTokenManager.expirationTime >= new Date().getTime()) {
      this.user = userData;
      this.userSubject.next(userData);
      console.log('Auto-login successful', userData);
      this.updateUser(userData);
      return of(true); // User auto-logged in successfully
    } else {
      return of(false); // Token has expired
    }
  }
}
