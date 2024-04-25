import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss'],
})
export class RegisterComponent {

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  constructor(private auth: AuthService, private firestoreService: FirestoreService, private router: Router, private alertController: AlertController) {}

  async registerNewUser() {
    if (this.email == '' || this.password == '' || this.firstName == '' || this.lastName == '') {
      this.presentRegisterPageAlert("Error", "Please fill in all the fields.");
      return;
    }
    try {
      const userCredential = await this.auth.register(this.email, this.password);
      if (userCredential) {
        await this.firestoreService.upsert('users', userCredential.user.uid, {uid: userCredential.user.uid, email: this.email, firstName: this.firstName, lastName: this.lastName, lastLogin: new Date(), displayName: this.firstName + " " + this.lastName});
        this.presentRegisterPageAlert("Success", "User registered successfully. Feel free to log in now. :D");
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      this.presentRegisterPageAlert("Error", error.message);
    }
  }

  setEmail(event:any){
    this.email = event.target.value;
  }

  setPassword(event:any){
    this.password = event.target.value;
  }

  setFirstName(event:any){
    this.firstName = event.target.value;
  }

  setLastName(event:any){
    this.lastName = event.target.value;
  }

  async presentRegisterPageAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
