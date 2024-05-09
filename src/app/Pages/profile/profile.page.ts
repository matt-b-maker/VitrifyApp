import { Component, OnInit } from '@angular/core';
import { LoadingController, isPlatform } from '@ionic/angular';
import { User } from 'firebase/auth';
import { Recipe } from 'src/app/Models/recipeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { FirebaseStorageService } from 'src/app/Services/firebase-storage.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { GeminiService } from 'src/app/Services/gemini.service';
import { RecipesService } from 'src/app/Services/recipes.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserMeta } from 'src/app/Models/userMetaModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  glazeRecipe: string[] = [];
  title: string = '';
  user: User | null = null;
  suggestionDescription: string = '';
  userRecipes!: Recipe[];
  loaded: boolean = false;
  isMobile: boolean = isPlatform('cordova');
  imageUrl: string = '';
  cameraSource: CameraSource = CameraSource.Camera;
  photosSource: CameraSource = CameraSource.Photos;
  userMeta: UserMeta | null = this.auth.userMeta;

  constructor(private auth: AuthService, private loadingCtrl: LoadingController, private recipeService: RecipesService, private firestoreService: FirestoreService, private firebaseStorage: FirebaseStorageService) {
    (async () => {
      await this.initializeRecipes();
    })();
  }

  async initializeRecipes(): Promise<void> {
    // this.loaded = false;
    // let uid = this.auth.user?.uid || '';
    // if (!uid) return console.error('User not logged in');
    // await this.firestoreService.getUserRecipes(uid).then((recipes) => {
    //   this.userRecipes = recipes;
    //   this.recipeService.recipes = recipes;
    // });
    // this.loaded = true;
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user;
      this.title = this.user?.displayName ?? '';
    });
    this.auth.userMeta$.subscribe(userMeta => {
      this.userMeta = userMeta;
      this.imageUrl = this.userMeta?.photoUrl || this.user?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg";
    });
  }
}
