import { Component, OnDestroy, OnInit, ViewChild, getPlatform } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase/auth';
import { Router, RouterOutlet } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { App as CapacitorApp } from '@capacitor/app';
import { UserMeta } from './Models/userMetaModel';
import { MaterialsService } from './Services/materials.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    public auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private platform: Platform,
    private materialsService: MaterialsService
  ) {
    this.auth.user$.subscribe((user) => {
      this.user = user;
    });
    this.auth.userMeta$.subscribe((userMeta) => {
      this.userMeta = userMeta;
    });
      (async () => {
        await this.materialsService.setMaterials();
        console.log(this.materialsService.materials.length);
        //remove "LOI" from materials oxides
        this.materialsService.materials.forEach((material) => {
          material.Oxides.forEach((oxide) => {
            if (oxide.OxideName === 'LOI') {
              material.Oxides.splice(material.Oxides.indexOf(oxide), 1);
            }
            //sort oxides by analysis percentage
            material.Oxides.sort((a, b) => {
              return b.Analysis - a.Analysis;
            });
          });
        });
        console.log(this.materialsService.materials.slice(0,10));
      })();
      this.initializeApp();
    }

    isLoggedIn: boolean = false;
  user: User | null = null || this.auth.user;
  userMeta: UserMeta | null = this.auth.userMeta;
  profileImageUrl: string = '';
  private subscription: Subscription | undefined;
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'My Recipes', url: '/user-recipes', icon: 'book' },
    { title: 'Recipe Builder', url: '/recipe-builder', icon: 'construct' },
    { title: 'My Firing Schedules', url: '/user-firing-schedules', icon: 'flame'},
    { title: 'Firing Schedule Builder', url: '/firing-schedule-builder', icon: 'bar-chart' },
    { title: 'My Inventory', url: "/inventory", icon: 'file-tray-stacked'},
    { title: 'Materials', url: '/materials-tabs', icon: 'flask' },
    { title: 'Explore', url: '/explore', icon: 'globe' },
    { title: 'Learn', url: '/learn', icon: 'library' },
    { title: 'Profile', url: '/profile', icon: 'person' },
  ];

  initializeApp() {

    this.platform.ready().then(() => {
      CapacitorApp.addListener('backButton', async ({ canGoBack }) => {
        if (!canGoBack) {
          CapacitorApp.exitApp();
        } else {
          // Get the URL of the previous route if possible
          let previousUrl = (window.history.state && window.history.state.navigationId > 1)
            ? window.history.state['url'] : null;

          // Check if the next page in history is the login page
          if (previousUrl === '/login') {
            CapacitorApp.exitApp();
          } else {
            // This ensures that the default back button behavior is used
            window.history.back();
          }
        }
      });
    });
  }

  isLoginPage() {
    return (
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    );
  }

  async logOut() {
    //check with user first
    var confirm = await this.alertController.create({
      header: 'Just Checking',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Yup',
          handler: () => {
            confirm.dismiss('Yup');
            return true;
          },
        },
        {
          text: 'Nope',
          handler: () => {
            confirm.dismiss('Nope');
            return false;
          },
        },
      ],
    });

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
    this.subscription = this.auth.user$.subscribe((user) => {
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
