import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-panel',
  imports: [RouterLink],
  host: { class: 'hidden lg:block' },
  template: `
    <aside class="gradient-animated relative flex h-full min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-10">
      <div class="pointer-events-none absolute inset-0 opacity-[0.07]" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"></div>
      <div class="drift-fast pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-accent-300/20 blur-2xl"></div>
      <div class="drift-fast-reverse pointer-events-none absolute -left-20 bottom-32 h-72 w-72 rounded-full bg-teal-300/20 blur-2xl"></div>
      <div class="spin-medium pointer-events-none absolute -right-10 bottom-16 h-56 w-56 rounded-full border border-dashed border-white/25"></div>

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
        <div class="relative hidden [@media(min-height:640px)]:block">
          <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span class="ripple"></span>
            <span class="ripple" style="animation-delay: 1.3s"></span>
            <span class="ripple" style="animation-delay: 2.6s"></span>
          </div>
          <img
            [src]="image()"
            alt=""
            aria-hidden="true"
            width="1024"
            height="765"
            decoding="async"
            class="art-blend art-fade float-lively relative mx-auto h-auto max-h-60 w-auto"
          />
        </div>
        <p class="mt-4 text-xs text-emerald-100/80">© 2026 AutoSocial AI</p>
      </div>
    </aside>
  `,
})
export class AuthPanel {
  art = input<'review' | 'prism'>('review');
  image = computed(() => (this.art() === 'prism' ? 'images/prism.webp' : 'images/review.webp'));

  points = [
    'You review every video before it is published',
    'Connect accounts through official platform logins',
    'Schedule with your own timezone',
    'Track every post and retry anything that fails',
  ];
}