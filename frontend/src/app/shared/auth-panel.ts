import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-panel',
  imports: [RouterLink],
  host: { class: 'hidden lg:block' },
  template: `
    <aside class="gradient-animated relative flex h-full min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-10">
      <div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="drift pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-accent-300/20 blur-2xl"></div>
      <div class="drift-reverse pointer-events-none absolute -left-20 bottom-32 h-72 w-72 rounded-full bg-teal-300/20 blur-2xl"></div>
      <div class="spin-slow pointer-events-none absolute -right-10 bottom-16 h-44 w-44 rounded-full border border-dashed border-white/25"></div>

      <a routerLink="/" class="relative flex items-center gap-2 text-lg font-bold text-white">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-300 text-emerald-900">A</span>
        AutoSocial AI
      </a>

      <div class="relative">
        <h2 class="text-2xl font-extrabold leading-tight text-white xl:text-3xl">Plan, review, and schedule every post in one place</h2>

        <ul class="mt-6 space-y-3">
          @for (point of points; track point) {
            <li class="flex items-start gap-3 text-sm text-emerald-50">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-300 text-xs font-bold text-emerald-900">✓</span>
              {{ point }}
            </li>
          }
        </ul>
      </div>

      <div class="relative">
        <div class="relative hidden h-36 [@media(min-height:600px)]:block">
          <div class="float-slow absolute left-0 top-2 w-40 rounded-xl bg-white/10 p-3 ring-1 ring-white/25 backdrop-blur-md">
            <div class="flex h-14 items-center justify-center rounded-lg bg-white/10">
              <span class="pulse-ring flex h-8 w-8 items-center justify-center rounded-full bg-accent-300 text-xs text-emerald-900">▶</span>
            </div>
            <div class="mt-2 h-1.5 rounded-full bg-white/20">
              <div class="h-1.5 w-2/3 rounded-full bg-accent-300"></div>
            </div>
            <p class="mt-2 text-[11px] font-medium text-emerald-50">Video preview</p>
          </div>

          <div class="float-slow-delay absolute left-44 top-0 hidden w-48 rounded-xl bg-white/15 p-3 ring-1 ring-white/30 backdrop-blur-md xl:block">
            <p class="text-[10px] font-semibold uppercase tracking-wide text-accent-300">Scheduled</p>
            <p class="mt-1 text-sm font-semibold text-white">Tomorrow, 10:30 AM</p>
            <div class="mt-2 flex gap-1.5">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">F</span>
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white">I</span>
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">T</span>
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-sky-700 text-[9px] font-bold text-white">L</span>
            </div>
          </div>

          <div class="float-slow absolute bottom-0 left-0 flex items-center gap-2 rounded-full bg-accent-300 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-lg" style="animation-delay: 1s">
            <span>✓</span> Approved by you
          </div>
        </div>

        <p class="mt-4 text-xs text-emerald-100/80">© 2026 AutoSocial AI</p>
      </div>
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