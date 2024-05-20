import { CUSTOM_ELEMENTS_SCHEMA, NgModule, getPlatform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { Capacitor } from '@capacitor/core';

import { IonSelect, IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { BusyModalComponent } from './Components/busy-modal/busy-modal.component';
import { AngularFireModule } from '@angular/fire/compat';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { Status } from './Models/status';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const platform = Capacitor.getPlatform();

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, BusyModalComponent],
  imports: [BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            AngularFireModule.initializeApp(determineFirebaseConfig(platform)),
            IonicSelectableComponent,
            FormsModule,
            HttpClientModule,
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
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, GooglePlus, HttpClient, provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

// Custom function to determine Firebase config based on platform
function determineFirebaseConfig(platform: string) {
  switch (platform) {
    case 'android':
      return environment.firebaseAndroidConfig;
    case 'ios':
      return environment.firebaseIosConfig;
    default:
      return environment.firebaseWebConfig;
  }
}
