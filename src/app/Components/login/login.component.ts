import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/Services/auth.service';
import { OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { FirestoreService } from 'src/app/Services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController, private firestore: FirestoreService) {}

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      if (userCredential) {
        await this.firestore.upsert('users', userCredential.user.uid, { email: this.email, lastLogin: new Date(), displayName: userCredential.user.displayName});
        // Redirect or navigate to the next page after successful login
        this.router.navigate(['/folder/inbox']);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      this.presentLoginErrorAlert("Error", 'Invalid email or password. Please try again.');
    }
  }

  async loginWithGoogle() {
    try {
      const userCredential = await this.authService.loginWithGoogle();
      if (userCredential) {
        // Redirect or navigate to the next page after successful login
        this.router.navigate(['/folder/inbox']);
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      this.presentLoginErrorAlert("Error", 'An error occurred while logging in with Google. Please try again.');
    }
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

  async ngOnInit() {
    //log out if user is already logged in
    await this.authService.logout();
  }
}
