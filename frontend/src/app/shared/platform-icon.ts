import { Component, computed, input } from '@angular/core';

const BACKGROUNDS: Record<string, string> = {
  TikTok: 'bg-slate-900',
  LinkedIn: 'bg-sky-700',
  Facebook: 'bg-blue-600',
  Instagram: 'bg-gradient-to-tr from-amber-400 via-pink-500 to-fuchsia-600',
};

@Component({
  selector: 'app-platform-icon',
  template: `
    <span
      class="inline-flex shrink-0 items-center justify-center rounded-md text-white"
      [class]="background()"
      [style.width.px]="size()"
      [style.height.px]="size()"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        [style.width.px]="size() * 0.62"
        [style.height.px]="size() * 0.62"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        @switch (name()) {
          @case ('TikTok') {
            <path d="M14 4v10.5a3.5 3.5 0 1 1 -3.5 -3.5" />
            <path d="M14 4c.4 2.6 2 4 4.5 4.2" />
          }
          @case ('Instagram') {
            <rect x="4" y="4" width="16" height="16" rx="5" />
            <circle cx="12" cy="12" r="3.6" />
            <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" />
          }
          @case ('Facebook') {
            <path
              d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.3-.2-2.4-.2-2.3 0-3.7 1.4-3.7 3.8v2.5H8v3h2.5V21z"
              fill="currentColor"
              stroke="none"
            />
          }
          @case ('LinkedIn') {
            <path d="M7 10v7M7 7v.01M11 10v7M11 12.5a2.5 2.5 0 0 1 5 0V17" />
          }
          @default {
            <circle cx="12" cy="12" r="6" />
          }
        }
      </svg>
    </span>
  `,
})
export class PlatformIcon {
  name = input.required<string>();
  size = input(20);
  background = computed(() => BACKGROUNDS[this.name()] ?? 'bg-slate-500');
}