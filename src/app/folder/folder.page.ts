import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { AuthService } from '../Services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  user: User | null = null;
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) {}

  async ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getFirstName()
  {
    if(this.user?.displayName){
      return this.user.displayName.split(' ')[0];
    }
    return '';
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
      await this.authService.logout();
      // Redirect or navigate to the next page after successful logout
      this.router.navigate(['/login']);
    } else {
    }
  }
}
