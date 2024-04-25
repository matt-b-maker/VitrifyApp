import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { signInWithCredential } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  errorMessage: string = '';
  public user: User | null = null;

  constructor(private auth: Auth, private gPlus: GooglePlus, private afAuth: AngularFireModule, private platform: Platform, private alertController: AlertController) {
    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
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
      const alert = await this.alertController.create({
        header: 'Platform is...',
        message: 'Web',
        buttons: ['OK']
      });
      await alert.present();
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
}
