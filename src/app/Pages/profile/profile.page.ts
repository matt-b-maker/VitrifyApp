import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { Recipe } from 'src/app/Models/recipeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { FirestoreService } from 'src/app/Services/firestore.service';
import { GeminiService } from 'src/app/Services/gemini.service';
import { RecipesService } from 'src/app/Services/recipes.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit{
  glazeRecipe: string[] = [];
  title: string = '';
  user: User | null = null;
  suggestionDescription: string = '';
  userRecipes!: Recipe[];
  loaded: boolean = false;

  constructor(private auth: AuthService, private loadingCtrl: LoadingController, private recipeService: RecipesService, private firestoreService: FirestoreService) {
    (async () => {
      await this.initializeRecipes();
    })();
  }

  async initializeRecipes(): Promise<void> {
    this.loaded = false;
    let uid = this.auth.user?.uid || '';
    if (!uid) return console.error('User not logged in');
    console.log('User ID:', uid);
    await this.firestoreService.getUserRecipes(uid).then((recipes) => {
      this.userRecipes = recipes;
      this.recipeService.recipes = recipes;
      console.log('User recipes:', this.userRecipes);
    });
    this.loaded = true;
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user;
      this.title = this.user?.displayName ?? '';
    });
  }

  setDescription(event: any) {
    this.suggestionDescription = event.target.value;
  }
}
