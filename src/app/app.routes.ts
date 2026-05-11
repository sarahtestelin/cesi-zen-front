import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

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
  {
        path: 'ressources',
    loadComponent: () => import('./features/resources/resources').then((m) => m.Resources),
    },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'utilisateurs',
        loadComponent: () =>
          import('./features/admin/users/admin-users').then((m) => m.AdminUsers),
      },
      {
        path: 'questions-diagnostic',
        loadComponent: () =>
          import('./features/admin/diagnostic-questions/admin-diagnostic-questions')
            .then((m) => m.AdminDiagnosticQuestions),
      },
      {
        path: 'seuils-resultats',
        loadComponent: () =>
          import('./features/admin/result-configs/admin-result-configs')
            .then((m) => m.AdminResultConfigs),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
