import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/Services/auth.service';
import { GeminiService } from 'src/app/Services/gemini.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit{
  glazeRecipe: string[] = [];
  title: string = '';
  user: User | null = null;
  constructor(private auth: AuthService, private gemini: GeminiService, private loadingCtrl: LoadingController) {

  }

  async askGemini(){
    const loading = await this.loadingCtrl.create({
      message: 'Getting Recipe Suggestion...',
      spinner: 'bubbles',
      translucent: true,
    });

    loading.present();
    const rawRecipe = await this.gemini.runChat("Give me a glaze recipe for a cone 6 turqouise glaze in a list format, and keep it brief. like 1,2,3,4,5... no asterisks, but include notes if you think they are necessary.");
    this.glazeRecipe = rawRecipe.split(/\r?\n/);
    console.log(rawRecipe);
    loading.dismiss();
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user;
      this.title = this.user?.displayName ?? '';
    });
  }
}
