import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PlatformServiceService {

  currentPlatform: string = '';

  constructor(private platform: Platform) {
    //get current platform
    switch (true) {
      case this.platform.is('android'):
        this.currentPlatform = 'android';
        break;
      case this.platform.is('ios'):
        this.currentPlatform = 'ios';
        break;
      default:
        this.currentPlatform = 'web';
    }
  }

  getPlatform(): string {
    return this.currentPlatform;
  }
  
}
