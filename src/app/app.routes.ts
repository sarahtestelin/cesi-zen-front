import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'informations',
        loadComponent: () =>
          import('./features/informations/informations').then((m) => m.Informations),
      },
      {
        path: 'diagnostic',
        loadComponent: () => import('./features/diagnostic/diagnostic').then((m) => m.Diagnostic),
      },
      {
        path: 'connexion',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'inscription',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'profil',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
