import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { UserCredential, signInWithCredential } from 'firebase/auth';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { UserMeta } from '../Models/userMetaModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();
  public userMetaSubject: BehaviorSubject<UserMeta | null> =
    new BehaviorSubject<UserMeta | null>(null);
  userMeta$: Observable<UserMeta | null> = this.userMetaSubject.asObservable();
  public loggedIn: boolean = false;
  errorMessage: string = '';
  public user: User | null = null;
  public userMeta: UserMeta | null = null;

  constructor(
    private auth: Auth,
    private gPlus: GooglePlus,
    private afAuth: AngularFireModule,
    private platform: Platform,
    private alertController: AlertController
  ) {
    let user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userSubject.next(this.user);
    }
    this.auth.onAuthStateChanged((user) => {
      this.userSubject.next(user);
    });

    let userMeta = localStorage.getItem('userMeta');
    if (userMeta) {
      this.userMeta = JSON.parse(userMeta);
      this.userMetaSubject.next(this.userMeta);
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    this.removeAuthData();
    this.user = null;
    this.userSubject.next(null);
    this.userMeta = null;
    this.userMetaSubject.next(null);
    // if (this.platform.is('cordova')) {
    //   return await this.gPlus.logout();
    // }
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
        webClientId:
          '478684273334-cupehva2rmu8ce5h0ibti3fmrjgr659j.apps.googleusercontent.com',
        offline: true,
        scopes: 'profile email',
      });
      const googleCredential = GoogleAuthProvider.credential(gPlusUser.idToken);
      return await signInWithCredential(this.auth, googleCredential);
    } catch (error: any) {
      this.errorMessage = error.message;
      return null;
    }
  }

  async webGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error) {
      throw error; // Re-throw the error to handle it in the calling code if needed
    }
  }

  getUser() {
    return this.auth.currentUser;
  }

  updateUser(user: User) {
    this.userSubject.next(user);
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  updateMeta(userMeta: UserMeta) {
    this.userMetaSubject.next(userMeta);
    this.userMeta = userMeta;
    localStorage.setItem('userMeta', JSON.stringify(userMeta));
  }

  isLoggedIn() {
    return this.user != null;
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  get userIsAuthenticated() {
    if (!this.userSubject) {
      return of(false);
    }
    return this.userSubject.asObservable().pipe(
      map((user) => {
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
      // Cast this.user to any temporarily to bypass the type checking
      const tokenManager = (this.user as any).stsTokenManager;
      return !!tokenManager.refreshToken;
    } else {
      return false;
    }
  }

  storeAuthData(user: User, userMeta: UserMeta | null) {
    //store based on platform
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userMeta', JSON.stringify(userMeta));
  }

  removeAuthData() {
    localStorage.removeItem('user');
    localStorage.removeItem('userMeta');
  }

  autoLogin(): Observable<boolean> {
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      return of(false); // No user data in localStorage
    }

    const userData = JSON.parse(userDataString);
    // Check if token is still valid
    if (
      userData.stsTokenManager &&
      userData.stsTokenManager.expirationTime >= new Date().getTime()
    ) {
      const userMetaString = localStorage.getItem('userMeta');
      if (userMetaString) {
        this.userMeta = JSON.parse(userMetaString);
        this.userMetaSubject.next(this.userMeta);
      }
      this.user = userData;
      this.userSubject.next(userData);
      this.updateUser(userData);
      return of(true); // User auto-logged in successfully
    } else {
      return of(false); // Token has expired
    }
  }
}
