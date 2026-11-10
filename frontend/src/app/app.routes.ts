import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { Shell } from './layout/shell/shell';
import { Create } from './pages/create/create';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'signin', component: Signin },
  { path: 'signup', component: Signup },
  {
    path: 'app',
    component: Shell,
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: Create },
      { path: 'dashboard', component: Dashboard },
    ],
  },
  { path: '**', redirectTo: '' },
];