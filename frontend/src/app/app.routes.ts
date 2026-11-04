import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
    ],
  },
];