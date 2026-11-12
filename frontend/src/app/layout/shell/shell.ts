import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
})
export class Shell {
  private router = inject(Router);
  auth = inject(AuthService);

  menuOpen = signal(false);

  links = [
    { label: 'Demo', path: '/app/demo', paidOnly: false },
    { label: 'Create post', path: '/app/create', paidOnly: true },
    { label: 'Posts', path: '/app/posts', paidOnly: true },
    { label: 'Accounts', path: '/app/accounts', paidOnly: true },
    { label: 'Dashboard', path: '/app/dashboard', paidOnly: true },
    { label: 'Plans', path: '/app/upgrade', paidOnly: false },
    { label: 'Settings', path: '/app/settings', paidOnly: false },
    { label: 'Help and support', path: '/app/support', paidOnly: false },
  ];

  get initial() {
    return (this.auth.user()?.name ?? 'U')[0].toUpperCase();
  }

  get planLabel() {
    const plan = this.auth.user()?.plan ?? 'trial';
    return plan === 'trial' ? 'Free trial' : `${plan[0].toUpperCase()}${plan.slice(1)} plan`;
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.closeMenu();
    this.auth.signOut();
    this.router.navigate(['/signin']);
  }
}