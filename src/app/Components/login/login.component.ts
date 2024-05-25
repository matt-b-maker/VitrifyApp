import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/Services/auth.service';
import { OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { GlazeLogoGetterService } from 'src/app/Services/glaze-logo-getter.service';
import { UserMeta } from 'src/app/Models/userMetaModel';
import { Recipe } from 'src/app/Models/recipeModel';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileSystemService } from 'src/app/Services/file-system.service';
import { MaterialsService } from 'src/app/Services/materials.service';
import { user } from '@angular/fire/auth';
import { InventoryService } from 'src/app/Services/inventory.service';
import { TestingService } from 'src/app/Services/testing.service';
import { RecipesService } from 'src/app/Services/recipes.service';

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
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  chosenGlaze: Glaze | null = null;
  userFromStorage: User | null = null;
  userMeta: UserMeta | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private firestore: FirestoreService,
    private glazeGetter: GlazeLogoGetterService,
    private loadingCtrl: LoadingController,
    private materialsService: MaterialsService,
    private recipesService: RecipesService,
    private inventoryService: InventoryService,
    private testingService: TestingService
  ) {
    this.authService.userSubject.subscribe((user) => {
      this.userFromStorage = user;
    });
    this.authService.userMetaSubject.subscribe((userMeta) => {
      this.userMeta = userMeta;
    });
  }

  ngOnInit(): void {
    //get random glaze from glazeGetter service
    this.chosenGlaze = this.glazeGetter.getRandomGlaze();
  }

  async login(emailAndPassword: boolean) {
    let userCredential: any;
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'bubbles',
      translucent: true,
    });
    if (emailAndPassword) {
      if (!this.email || !this.password) {
        this.presentLoginErrorAlert(
          'Error',
          'Please enter your email and password to log in.'
        );
        return;
      }
      loading.present();
      userCredential = await this.authService.login(this.email, this.password);
    } else {
      loading.present();
      try {
        userCredential = await this.authService.loginWithGoogle();
      }
      catch (error) {
        console.error('Error logging in with Google:', error);
        loading.dismiss();
        return;
      }
    }
    if (userCredential) {
      let userMeta: UserMeta | undefined = await this.firestore.getUser(
        'users',
        userCredential.user.uid
      );
      if (!userMeta) {
        userMeta = {
          firstName: userCredential.user.firstName,
          lastName: userCredential.user.lastName,
          email: userCredential.user.email,
          lastLogin: new Date(),
          displayName: emailAndPassword
            ? userCredential.user.firstName + ' ' + userCredential.user.lastName
            : userCredential.user.displayName,
          photoUrl: emailAndPassword
            ? '../assets/default-profile-photo.jpg'
            : userCredential.user.photoURL,
          isPremium: false,
          uid: userCredential.user.uid,
          nickname: userCredential.displayName,
        };
        await this.firestore.upsert('users', userCredential.user.uid, userMeta);
        this.authService.updateUser(userCredential.user);
        this.authService.updateMeta(userMeta);
        return;
      }

      userMeta.lastLogin = new Date();
      if (userMeta.displayName == null || userMeta.displayName == '')
        userMeta.displayName =
          userCredential.user.firstName + ' ' + userCredential.user.lastName;
      if (userMeta.photoUrl == null || userMeta.photoUrl == '')
        userMeta.photoUrl = emailAndPassword
          ? 'https://ionicframework.com/docs/img/demos/avatar.svg'
          : userCredential.user.photoURL;
      if (userMeta.isPremium == null) userMeta.isPremium = false;
      if (userMeta.uid == null || userMeta.uid == '')
        userMeta.uid = userCredential.user.uid;
      if (userMeta.nickname == null || userMeta.nickname == '')
        userMeta.nickname = userCredential.user.displayName;
      await this.firestore.upsert('users', userCredential.user.uid, userMeta);
      this.authService.updateUser(userCredential.user);
      this.authService.updateMeta(userMeta);
      this.recipesService.userRecipes = await this.firestore.getUserRecipes(userMeta.uid || '');
      await this.inventoryService.getUserInventory();
      await this.testingService.getUserTestBatches();
      loading.dismiss();
      this.router.navigate(['/profile']);
    } else {
      if (emailAndPassword) {
        this.presentLoginErrorAlert(
          'Error',
          'Invalid email or password. Please try again or register for a new account below.'
        );
      } else {
        this.presentLoginErrorAlert(
          'Error',
          'An error occurred while logging in with Google. Please try again.'
        );
      }
    }
  }

  async logOut() {
    //check with user first
    var confirm = window.confirm('Are you sure you want to log out?');
    if (!confirm) {
      return;
    }

    await this.authService.logout();
    // Redirect or navigate to the next page after successful logout
    this.router.navigate(['/login']);
  }

  async resetPassword() {
    if (!this.email) {
      this.presentLoginErrorAlert(
        'Error',
        'Please enter your email address to reset your password.'
      );
      return;
    }
    let emailExists: boolean = false;
    await this.firestore
      .getCollection('users', undefined)
      .then((collection: any) => {
        collection.forEach((user: User) => {
          if (user.email == this.email) {
            emailExists = true;
          }
        });
      });
    if (!emailExists) {
      this.presentLoginErrorAlert(
        'Error',
        'That email address is not associated with an account. Please try again.'
      );
      return;
    }
    this.authService
      .resetPassword(this.email)
      .then(() => {
        this.presentLoginErrorAlert(
          'Success',
          'Password reset email sent. Please check your email.'
        );
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        this.presentLoginErrorAlert(
          'Error',
          'An error occurred while resetting your password. Please try again.'
        );
      });
  }

  async presentLoginErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  setEmail(event: any) {
    this.email = event.target.value;
  }
  setPassword(event: any) {
    this.password = event.target.value;
  }
}
