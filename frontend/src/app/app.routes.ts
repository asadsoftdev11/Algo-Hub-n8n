import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard, subscribedGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { Home } from './pages/home/home';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { Legal } from './pages/legal/legal';
import { Shell } from './layout/shell/shell';
import { Demo } from './pages/demo/demo';
import { Upgrade } from './pages/upgrade/upgrade';
import { Settings } from './pages/settings/settings';
import { Create } from './pages/create/create';
import { Posts } from './pages/posts/posts';
import { Accounts } from './pages/accounts/accounts';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signin', component: Signin },
  { path: 'signup', component: Signup },
  { path: 'privacy', component: Legal, data: { doc: 'privacy' } },
  { path: 'terms', component: Legal, data: { doc: 'terms' } },
  {
    path: 'app',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: () => (inject(AuthService).isSubscribed() ? 'create' : 'demo'), pathMatch: 'full' },
      { path: 'demo', component: Demo },
      { path: 'upgrade', component: Upgrade },
      { path: 'settings', component: Settings },
      { path: 'create', component: Create, canActivate: [subscribedGuard] },
      { path: 'posts', component: Posts, canActivate: [subscribedGuard] },
      { path: 'accounts', component: Accounts, canActivate: [subscribedGuard] },
      { path: 'dashboard', component: Dashboard, canActivate: [subscribedGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];