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
    { label: 'Demo', path: '/app/demo', paidOnly: false, icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z M10 8l6 4-6 4z' },
    { label: 'Create post', path: '/app/create', paidOnly: true, icon: 'M12 5v14M5 12h14' },
    { label: 'Posts', path: '/app/posts', paidOnly: true, icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
    { label: 'Accounts', path: '/app/accounts', paidOnly: true, icon: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' },
    { label: 'Dashboard', path: '/app/dashboard', paidOnly: true, icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
    { label: 'Plans', path: '/app/upgrade', paidOnly: false, icon: 'M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zM1 10h22' },
    { label: 'Settings', path: '/app/settings', paidOnly: false, icon: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6' },
    { label: 'Help and support', path: '/app/support', paidOnly: false, icon: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01' },
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