import { NgModule, getPlatform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { Capacitor } from '@capacitor/core';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { BusyModalComponent } from './Components/busy-modal/busy-modal.component';
import { IngredientComponent } from './Components/ingredient/ingredient.component';

const platform = Capacitor.getPlatform();

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, BusyModalComponent, IngredientComponent],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            provideFirebaseApp(() => {
              switch (platform) {
                case 'android':
                  return initializeApp(environment.firebaseAndroidConfig);
                case 'ios':
                  return initializeApp(environment.firebaseIosConfig);
                default:
                  return initializeApp(environment.firebaseWebConfig);
              }
            }),
            provideAuth(() => getAuth()),
            provideFirestore(() => getFirestore())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
