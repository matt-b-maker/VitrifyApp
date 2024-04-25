import { Component, OnDestroy, OnInit, getPlatform } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy{
  constructor(public auth: AuthService, private router: Router, private alertController: AlertController, private platform: Platform
  ) {
    this.initializeApp();
  }
  isLoggedIn: boolean = false;
  user : User | null = null;
  private subscription: Subscription | undefined;
  public appPages = [
    { title: 'Home', url: '/folder/inbox', icon: 'mail' },
    { title: 'Glaze Recipes', url: '/recipe', icon: 'beaker' },
    { title: 'Profile', url: '/profile', icon: 'person' }
  ];
  public labels = ['Family', 'Friends'];

  initializeApp() {
    this.platform.ready().then(() => {
      CapacitorApp.addListener('backButton', ({canGoBack}) => {
        if(!canGoBack){
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });
    });
  }



  isLoginPage() {
    return window.location.pathname === '/login' || window.location.pathname === '/register';
  }

  async logOut() {
    //check with user first
    var confirm = await this.alertController.create({
      header: "Just Checking",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          text: 'Yup',
          handler: () => {
            confirm.dismiss('Yup');
            return true;
          }
        },
        {
          text: 'Nope',
          handler: () => {
            confirm.dismiss('Nope');
            return false;
          }
        }
      ]
    })

    await confirm.present();

    // Wait for the user's response
    const role = await confirm.onDidDismiss();
    // Check the user's response
    if (role.data === 'Yup') {
      await this.auth.logout();
      // Redirect or navigate to the next page after successful logout
      this.router.navigate(['/login']);
    } else {
    }
  }

  ngOnInit() {
    this.subscription = this.auth.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
