import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/Services/auth.service';
import { OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { GlazeLogoGetterService } from 'src/app/Services/glaze-logo-getter.service';
import { BusyModalComponent } from '../busy-modal/busy-modal.component';
import { UserMeta } from 'src/app/Models/user';

interface Glaze {
  imageUrl: string;
  title: string;
  creator: string;
  year: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  chosenGlaze: Glaze | null = null;
  userFromStorage: User | null = null;
  userMeta: UserMeta | null = null;

  constructor(private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private firestore: FirestoreService,
    private glazeGetter: GlazeLogoGetterService,
    private loadingCtrl: LoadingController)
    {
      this.authService.userMetaSubject.subscribe((userMeta) => {
        this.userMeta = userMeta;
      });
    }

  ngOnInit(): void {
    //get random glaze from glazeGetter service
    this.chosenGlaze = this.glazeGetter.getRandomGlaze();
  }

  async login() {
    if (!this.email || !this.password) {
      this.presentLoginErrorAlert("Error", 'Please enter your email and password to log in.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'bubbles',
      translucent: true,
    });

    loading.present();

    try {
      const userCredential = await this.authService.login(this.email, this.password);
      if (userCredential) {
        if (userCredential.user.displayName == null) {
          await this.firestore.getUser('users', userCredential.user.uid).then((user: any) => {
            user.displayName = user.firstName + ' ' + user.lastName;
            this.authService.updateUser(user);
          });
        }

        await this.firestore.upsert('users', userCredential.user.uid, { email: this.email, lastLogin: new Date(), displayName: userCredential.user.displayName});

        loading.dismiss();
        this.firestore.getUser('users', userCredential.user.uid).then((userMetaData: any) => {
          console.log('User meta:', userMetaData);
          this.authService.userMeta = userMetaData;
          this.authService.userMetaSubject.next(userMetaData);
          this.authService.storeAuthData(userCredential.user, userMetaData);
        });
        // Redirect or navigate to the next page after successful login
        this.router.navigate(['/folder/inbox']);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      loading.dismiss();
      this.presentLoginErrorAlert("Error", 'Invalid email or password. Please try again or register for a new account below.');
    }
  }

  async loginWithGoogle() {

    try {
      const userCredential = await this.authService.loginWithGoogle();
      if (userCredential) {
        const loading = await this.loadingCtrl.create({
          message: 'Logging in...',
          spinner: 'bubbles',
          translucent: true,
        });

        loading.present();
        this.authService.updateUser(userCredential.user);
        await this.firestore.upsert('users', userCredential.user.uid, { email: userCredential.user.email, lastLogin: new Date(), displayName: userCredential.user.displayName});
        this.firestore.getUser('users', userCredential.user.uid).then((userMetaData: any) => {
          this.authService.userMeta = userMetaData;
          this.authService.userMetaSubject.next(userMetaData);
          this.authService.storeAuthData(userCredential.user, userMetaData);
        });
        // Redirect or navigate to the next page after successful login
        loading.dismiss();
        this.router.navigate(['/folder/inbox']);
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      this.presentLoginErrorAlert("Error", 'An error occurred while logging in with Google. Please try again.');
    }
  }

  async logOut() {
    //check with user first
    var confirm = window.confirm("Are you sure you want to log out?");
    if (!confirm) {
      return;
    }

    await this.authService.logout();
    // Redirect or navigate to the next page after successful logout
    this.router.navigate(['/login']);
  }

  async resetPassword() {
    if (!this.email){
      this.presentLoginErrorAlert("Error", 'Please enter your email address to reset your password.');
      return;
    }
    let emailExists: boolean = false;
    await this.firestore.getCollection('users', undefined).then((collection: any) => {
      collection.forEach((user: User) => {
        if (user.email == this.email) {
          emailExists = true;
        }
      });
    });
    if (!emailExists) {
      this.presentLoginErrorAlert("Error", 'That email address is not associated with an account. Please try again.');
      return;
    }
    this.authService.resetPassword(this.email).then(() => {
      this.presentLoginErrorAlert("Success", 'Password reset email sent. Please check your email.');
    }).catch((error) => {
      console.error('Error resetting password:', error);
      this.presentLoginErrorAlert("Error", 'An error occurred while resetting your password. Please try again.');
    });
  }

  async presentLoginErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  setEmail(event:any){
    this.email = event.target.value;
  }
  setPassword(event:any){
    this.password = event.target.value;
  }


}
