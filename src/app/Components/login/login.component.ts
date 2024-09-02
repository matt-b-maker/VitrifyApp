import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
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
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

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
    private testingService: TestingService,
    private platform: Platform
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
    this.platform.ready().then(() => {
      console.log('ALERT ALERT Platform ready');
      this.initPushNotifications();
    });
  }

  initPushNotifications() {
    // Request permission to use push notifications
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        console.log('ALERT ALERT Push registration success, token: ' + result.receive);
        PushNotifications.register();
      } else {

      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('My token: ' + token.value);
      localStorage.setItem('token', token.value);
    });
    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Push received: ' + JSON.stringify(notification));
      // Show a local notification when the app is in the foreground
      LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || "New Notification",
            body: notification.body || "You have a new message.",
            id: Math.floor(Math.random() * 1000000), // Generate a random int ID
            schedule: { at: new Date(Date.now() + 1000) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: "",
            extra: null
          }
        ]
      });
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
      this.router.navigate(['/user-recipes/' + notification.notification.data.recipeId]);
    });
  }

  async updateToken() {
    const token = localStorage.getItem('token');
    if (token) {
      await this.firestore.updateFcmToken(token);
    }
  }

  hasOnlyOneEmptyProperty(obj: { [key: string]: any }): boolean {
    const keys = Object.keys(obj);
    return keys.length === 1 && obj[keys[0]] === '';
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
      try {
        userCredential = await this.authService.login(this.email, this.password);
      }
      catch (error) {
        loading.dismiss();
        this.presentLoginErrorAlert(
          'Error',
          'Invalid email or password. Please try again or register for a new account below.'
        );
        return;
      }
    } else {
      loading.present();
      try {
        userCredential = await this.authService.loginWithGoogle();
      }
      catch (error) {
        loading.dismiss();
        console.error('Error logging in with Google:', error);
        return;
      }
    }
    if (userCredential) {
      if (userCredential.user.emailVerified === false) {
        loading.dismiss();
        this.presentLoginErrorAlert(
          'Error',
          'Please verify your email before logging in.'
        );
        return;
      }
      let userMeta: UserMeta | undefined = await this.firestore.getUser(
        'users',
        userCredential.user.uid
      );
      if (!userMeta || userMeta == undefined || userMeta == null || this.hasOnlyOneEmptyProperty(userMeta)) {
        userMeta = {
          firstName: userCredential.user.displayName.split(' ')[0],
          lastName: Array.from(userCredential.user.displayName.split(' ')).slice(1).join(' '),
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
          nickname: userCredential.user.displayName,
        };
        await this.firestore.upsert('users', userCredential.user.uid, userMeta);
        this.authService.updateUser(userCredential.user);
        this.authService.updateMeta(userMeta);
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
      this.recipesService.allRecipes = await this.firestore.getPublicRecipes();
      await this.inventoryService.getUserInventory();
      await this.testingService.getUserTestBatches();
      await this.updateToken();
      loading.dismiss();
      this.router.navigate(['/profile']);
    } else {
      if (emailAndPassword) {
        loading.dismiss();
        this.presentLoginErrorAlert(
          'Error',
          'Invalid email or password. Please try again or register for a new account below.'
        );
      } else {
        loading.dismiss();
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
