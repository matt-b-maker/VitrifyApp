import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthGuard } from './Services/auth.guard';
import { AuthRedirectGuard } from './Services/auth-redirect.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
    canActivate: [AuthRedirectGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'recipe',
    loadChildren: () => import('./Pages/recipe/recipe.module').then( m => m.RecipePageModule),
    canActivate: [AuthRedirectGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./Pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthRedirectGuard]
  },
  {
    path: 'user-recipes',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/user-recipes/user-recipes.module').then( m => m.UserRecipesPageModule),
        canActivate: [AuthRedirectGuard]
      },
      {
        path: ':recipeId',
        loadChildren: () => import('./Pages/user-recipes/user-recipe-detail/user-recipe-detail.module').then( m => m.UserRecipeDetailPageModule),
        canActivate: [AuthRedirectGuard]
      },

    ]
  },
  {
    path: 'community-recipes',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/community-recipes/community-recipes.module').then( m => m.CommunityRecipesPageModule),
        canActivate: [AuthRedirectGuard]
      },
      {
        path: ':recipeId',
        loadChildren: () => import('./Pages/community-recipes/community-recipe-detail/community-recipe-detail.module').then( m => m.CommunityRecipeDetailPageModule),
        canActivate: [AuthRedirectGuard]
      }
    ]
  },
  {
    path: 'user-firing-schedules',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/user-firing-schedules/user-firing-schedules.module').then( m => m.UserFiringSchedulesPageModule),
        canActivate: [AuthRedirectGuard]
      },
      {
        path: ':firingScheduleId',
        loadChildren: () => import('./Pages/user-firing-schedules/user-firing-schedule-detail/user-firing-schedule-detail.module').then( m => m.UserFiringScheduleDetailPageModule),
        canActivate: [AuthRedirectGuard]
      }
    ]
  },
  {
    path: 'community-firing-schedules',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/community-firing-schedules/community-firing-schedules.module').then( m => m.CommunityFiringSchedulesPageModule),
        canActivate: [AuthRedirectGuard]
      },
      {
        path: ':firingScheduleId',
        loadChildren: () => import('./Pages/community-firing-schedules/community-firing-schedule-detail/community-firing-schedule-detail.module').then( m => m.CommunityFiringScheduleDetailPageModule),
        canActivate: [AuthRedirectGuard]
      }
    ]
  },
  {
    path: 'recipe-builder',
    loadChildren: () => import('./Pages/recipe-builder/recipe-builder.module').then( m => m.RecipeBuilderPageModule),
    canActivate: [AuthRedirectGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
