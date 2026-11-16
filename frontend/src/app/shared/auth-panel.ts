import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-panel',
  imports: [RouterLink],
  template: `
    <aside class="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-12 lg:flex">
      <div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl"></div>

      <a routerLink="/" class="relative flex items-center gap-2 text-lg font-bold text-white">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-300 text-emerald-900">A</span>
        AutoSocial AI
      </a>

      <div class="relative">
        <h2 class="text-3xl font-extrabold leading-tight text-white">Plan, review, and schedule every post in one place</h2>
        <ul class="mt-8 space-y-4">
          @for (point of points; track point) {
            <li class="flex items-start gap-3 text-sm text-emerald-50">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-300 text-xs font-bold text-emerald-900">✓</span>
              {{ point }}
            </li>
          }
        </ul>
      </div>

      <p class="relative text-xs text-emerald-100/80">© 2026 AutoSocial AI</p>
    </aside>
  `,
})
export class AuthPanel {
  points = [
    'You review every video before it is published',
    'Connect accounts through official platform logins',
    'Schedule with your own timezone',
    'Track every post and retry anything that fails',
  ];
}