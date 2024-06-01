import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { RecipesService } from './recipes.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard {
  constructor(
    private alertController: AlertController,
    private recipeService: RecipesService
  ) {}

  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (component && component.canDeactivate) {
      return component.canDeactivate();
    } else {
      return this.confirmationDialog();
    }
  }

  private confirmationDialog(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // Immediately resolve if exiting is allowed
      if (this.recipeService.allowExit) {
        return resolve(true); // Resolve and exit the function
      }

      // Create and present the alert if not allowed to exit directly
      const alert = await this.alertController.create({
        header: 'Confirm',
        message: 'Do you really want to leave this page? Changes you made may not be saved.',
        buttons: [
          {
            text: 'Stay',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'Yep, sure do',
            handler: () => resolve(true),
          },
        ],
      });

      await alert.present();
    });
  }

}
