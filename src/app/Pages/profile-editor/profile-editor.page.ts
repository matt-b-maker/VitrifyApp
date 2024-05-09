import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { CameraSource, Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, LoadingController, isPlatform } from '@ionic/angular';
import { UserMeta } from 'src/app/Models/userMetaModel';
import { AuthService } from 'src/app/Services/auth.service';
import { FirebaseStorageService } from 'src/app/Services/firebase-storage.service';
import { FirestoreService } from 'src/app/Services/firestore.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.page.html',
  styleUrls: ['./profile-editor.page.scss'],
})
export class ProfileEditorPage implements OnInit{

  imageUrl: string = '';
  user: User | null = null;
  userMeta!: UserMeta | null;
  isMobile: boolean = true;
  cameraSource: CameraSource = CameraSource.Camera;
  photosSource: CameraSource = CameraSource.Photos;

  constructor(private loadingCtrl: LoadingController, private auth: AuthService, private firestoreService: FirestoreService, private firebaseStorage: FirebaseStorageService, private alertController: AlertController) {
    this.auth.user$.subscribe((user) => {
      this.user = user;
    });
    this.auth.userMeta$.subscribe((userMeta) => {
      this.userMeta = userMeta;
      this.imageUrl = this.userMeta?.photoUrl || this.auth.user?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg";
    });
    this.isMobile = isPlatform('cordova');
  }

  ngOnInit() {
    console.log('Profile editor page loaded');
  }

  async selectImage(source: CameraSource) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
      spinner: 'bubbles',
      translucent: true,
    });

    try {

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: source
      });

      if (image) {
        loading.present();
        const response = await fetch(image.webPath!);
        const blob = await response.blob();
        const filePath = `profile_images/${new Date().getTime()}_${image.format}`;
        const resultUrl = await this.firebaseStorage.uploadFile(filePath, blob as File);
        this.imageUrl = resultUrl;
        if (this.userMeta !== null) {
          this.userMeta.photoUrl = this.imageUrl;
          this.auth.updateMeta(this.userMeta);
          await this.firestoreService.upsert('users', this.auth.user?.uid || '', this.userMeta);
          if (this.user) this.auth.storeAuthData(this.user, this.userMeta);
        }
      }
      else {
        this.alertController.create({
          header: 'Error',
          message: 'Error with image',
          buttons: ['OK']
        }).then(alert => alert.present());
      }

      loading.dismiss();

    } catch (error) {
      loading.dismiss();
      console.error('Error accessing camera or gallery:', error);
    }
  }
  async uploadAndSetProfilePicture(event: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
      spinner: 'bubbles',
      translucent: true,
    });
    const file = event.target.files[0];
    if (!this.auth.user) return;
    const filePath = `profile_images/${this.auth.user.uid}_ProfilePhoto`;
    try {
      loading.present();
      const resultUrl = await this.firebaseStorage.uploadFile(filePath, file);
      this.imageUrl = resultUrl;
      if (this.userMeta) {
        this.userMeta.photoUrl = this.imageUrl;
        this.auth.updateMeta(this.userMeta);
        await this.firestoreService.upsert('users', this.auth.user?.uid || '', this.userMeta);
      }
      loading.dismiss();
    } catch (error) {
      loading.dismiss();
      console.error('Error uploading file:', error);
    }
  }

}
