import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard, guestGuard, subscribedGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  { path: '', title: 'AutoSocial AI', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'signin',
    title: 'Sign in - AutoSocial AI',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signin/signin').then((m) => m.Signin),
  },
  {
    path: 'signup',
    title: 'Create account - AutoSocial AI',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'forgot-password',
    title: 'Reset password - AutoSocial AI',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'verify-email',
    title: 'Verify your email - AutoSocial AI',
    loadComponent: () => import('./pages/verify-email/verify-email').then((m) => m.VerifyEmail),
  },
  {
    path: 'reset-password',
    title: 'Choose a new password - AutoSocial AI',
    loadComponent: () => import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
  },
  {
    path: 'privacy',
    title: 'Privacy Policy - AutoSocial AI',
    data: { doc: 'privacy' },
    loadComponent: () => import('./pages/legal/legal').then((m) => m.Legal),
  },
  {
    path: 'terms',
    title: 'Terms of Service - AutoSocial AI',
    data: { doc: 'terms' },
    loadComponent: () => import('./pages/legal/legal').then((m) => m.Legal),
  },
  {
    path: 'contact',
    title: 'Contact - AutoSocial AI',
    data: { embedded: false },
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: () => (inject(AuthService).isSubscribed() ? 'create' : 'demo') },
      { path: 'demo', title: 'Demo - AutoSocial AI', loadComponent: () => import('./pages/demo/demo').then((m) => m.Demo) },
      { path: 'upgrade', title: 'Plans - AutoSocial AI', loadComponent: () => import('./pages/upgrade/upgrade').then((m) => m.Upgrade) },
      { path: 'settings', title: 'Settings - AutoSocial AI', loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings) },
      {
        path: 'support',
        title: 'Help and support - AutoSocial AI',
        data: { embedded: true },
        loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
      },
      {
        path: 'create',
        title: 'Create post - AutoSocial AI',
        canActivate: [subscribedGuard],
        loadComponent: () => import('./pages/create/create').then((m) => m.Create),
      },
      { path: 'bulk', title: 'Bulk schedule - AutoSocial AI', loadComponent: () => import('./pages/bulk/bulk').then((m) => m.Bulk) },
      {
        path: 'posts',
        title: 'Posts - AutoSocial AI',
        canActivate: [subscribedGuard],
        loadComponent: () => import('./pages/posts/posts').then((m) => m.Posts),
      },
      {
        path: 'accounts',
        title: 'Accounts - AutoSocial AI',
        canActivate: [subscribedGuard],
        loadComponent: () => import('./pages/accounts/accounts').then((m) => m.Accounts),
      },
      {
        path: 'dashboard',
        title: 'Dashboard - AutoSocial AI',
        canActivate: [subscribedGuard],
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  { path: '**', title: 'Page not found - AutoSocial AI', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];