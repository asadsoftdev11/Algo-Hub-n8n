import { Component, ElementRef, inject, signal } from '@angular/core';

@Component({
  selector: 'app-password-field',
  host: { class: 'block' },
  template: `
    <div class="relative">
      <ng-content />
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-label]="visible() ? 'Hide password' : 'Show password'"
        [attr.aria-pressed]="visible()"
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          @if (visible()) {
            <path d="M17.94 17.94A10.07 10.07 0 0112 19c-7 0-11-7-11-7a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 7 11 7a18.5 18.5 0 01-2.16 3.19M14.12 14.12a3 3 0 11-4.24-4.24M1 1l22 22" />
          } @else {
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          }
        </svg>
      </button>
    </div>
  `,
})
export class PasswordField {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  visible = signal(false);

  toggle() {
    const input = this.host.nativeElement.querySelector('input');
    if (!input) return;
    this.visible.update((shown) => !shown);
    input.type = this.visible() ? 'text' : 'password';
  }
}