import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-panel',
  imports: [RouterLink],
  host: { class: 'hidden lg:block' },
  template: `
    <aside class="gradient-animated relative flex h-full min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-12">
      <div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-accent-300/10 blur-3xl"></div>

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

        <div class="relative mt-12 hidden h-48 w-full max-w-sm [@media(min-height:760px)]:block">
          <div class="float-slow absolute left-0 top-6 w-44 rounded-xl bg-white/10 p-3 ring-1 ring-white/25 backdrop-blur">
            <div class="flex aspect-video items-center justify-center rounded-lg bg-emerald-900/40">
              <span class="pulse-ring flex h-9 w-9 items-center justify-center rounded-full bg-accent-300 text-sm text-emerald-900">▶</span>
            </div>
            <div class="mt-3 h-1.5 w-full rounded-full bg-white/20">
              <div class="h-1.5 w-2/3 rounded-full bg-accent-300"></div>
            </div>
            <p class="mt-2 text-[11px] font-medium text-emerald-50">Video preview</p>
          </div>

          <div class="float-slow-delay absolute right-0 top-0 w-48 rounded-xl bg-white p-3 shadow-xl">
            <p class="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Scheduled</p>
            <p class="mt-1 text-sm font-semibold text-slate-800">Tomorrow, 10:30 AM</p>
            <div class="mt-2 flex gap-1.5">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">F</span>
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white">I</span>
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">T</span>
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-700 text-[9px] font-bold text-white">L</span>
            </div>
          </div>

          <div class="float-slow absolute bottom-0 right-8 flex items-center gap-2 rounded-full bg-accent-300 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-lg" style="animation-delay: 1s">
            <span>✓</span> Approved by you
          </div>
        </div>
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