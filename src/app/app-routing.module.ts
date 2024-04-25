import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'recipe',
    loadChildren: () => import('./Pages/recipe/recipe.module').then( m => m.RecipePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./Pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'user-recipes',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/user-recipes/user-recipes.module').then( m => m.UserRecipesPageModule)
      },
      {
        path: ':recipeId',
        loadChildren: () => import('./Pages/user-recipes/user-recipe-detail/user-recipe-detail.module').then( m => m.UserRecipeDetailPageModule)
      }
    ]
  },
  {
    path: 'community-recipes',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/community-recipes/community-recipes.module').then( m => m.CommunityRecipesPageModule)
      },
      {
        path: ':recipeId',
        loadChildren: () => import('./Pages/community-recipes/community-recipe-detail/community-recipe-detail.module').then( m => m.CommunityRecipeDetailPageModule)
      }
    ]
  },
  {
    path: 'user-firing-schedules',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/user-firing-schedules/user-firing-schedules.module').then( m => m.UserFiringSchedulesPageModule)
      },
      {
        path: ':firingScheduleId',
        loadChildren: () => import('./Pages/user-firing-schedules/user-firing-schedule-detail/user-firing-schedule-detail.module').then( m => m.UserFiringScheduleDetailPageModule)
      }
    ]
  },
  {
    path: 'community-firing-schedules',
    children: [
      {
        path: '',
        loadChildren: () => import('./Pages/community-firing-schedules/community-firing-schedules.module').then( m => m.CommunityFiringSchedulesPageModule)
      },
      {
        path: ':firingScheduleId',
        loadChildren: () => import('./Pages/community-firing-schedules/community-firing-schedule-detail/community-firing-schedule-detail.module').then( m => m.CommunityFiringScheduleDetailPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
