import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard, subscribedGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { Home } from './pages/home/home';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { Legal } from './pages/legal/legal';
import { NotFound } from './pages/not-found/not-found';
import { Shell } from './layout/shell/shell';
import { Demo } from './pages/demo/demo';
import { Upgrade } from './pages/upgrade/upgrade';
import { Settings } from './pages/settings/settings';
import { Create } from './pages/create/create';
import { Posts } from './pages/posts/posts';
import { Accounts } from './pages/accounts/accounts';
import { Dashboard } from './pages/dashboard/dashboard';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home, title: 'AutoSocial AI' },
  { path: 'signin', component: Signin, title: 'Sign in - AutoSocial AI' },
  { path: 'signup', component: Signup, title: 'Create account - AutoSocial AI' },
  { path: 'privacy', component: Legal, data: { doc: 'privacy' }, title: 'Privacy Policy - AutoSocial AI' },
  { path: 'terms', component: Legal, data: { doc: 'terms' }, title: 'Terms of Service - AutoSocial AI' },
  { path: 'contact', component: Contact, data: { embedded: false }, title: 'Contact - AutoSocial AI' },
  {
    path: 'app',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: () => (inject(AuthService).isSubscribed() ? 'create' : 'demo'), pathMatch: 'full' },
      { path: 'demo', component: Demo, title: 'Demo - AutoSocial AI' },
      { path: 'upgrade', component: Upgrade, title: 'Plans - AutoSocial AI' },
      { path: 'settings', component: Settings, title: 'Settings - AutoSocial AI' },
      { path: 'support', component: Contact, data: { embedded: true }, title: 'Help and support - AutoSocial AI' },
      { path: 'create', component: Create, canActivate: [subscribedGuard], title: 'Create post - AutoSocial AI' },
      { path: 'posts', component: Posts, canActivate: [subscribedGuard], title: 'Posts - AutoSocial AI' },
      { path: 'accounts', component: Accounts, canActivate: [subscribedGuard], title: 'Accounts - AutoSocial AI' },
      { path: 'dashboard', component: Dashboard, canActivate: [subscribedGuard], title: 'Dashboard - AutoSocial AI' },
    ],
  },
  { path: '**', component: NotFound, title: 'Page not found - AutoSocial AI' },
];