import { Component, inject } from '@angular/core';
import { ToastKind, ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <div class="pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast-in pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border bg-white p-3.5 pb-4 shadow-xl" [class]="styles[t.kind].border">
          <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" [class]="styles[t.kind].icon">
            <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              @switch (t.kind) {
                @case ('success') {
                  <path d="M5 13l4 4L19 7" />
                }
                @case ('error') {
                  <path d="M18 6L6 18M6 6l12 12" />
                }
                @default {
                  <path d="M12 8v.01M12 12v5" />
                }
              }
            </svg>
          </span>
          <p class="flex-1 text-sm font-medium text-slate-800">{{ t.message }}</p>
          <button type="button" (click)="toast.dismiss(t.id)" aria-label="Dismiss" class="rounded p-0.5 text-slate-400 transition hover:text-slate-700">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <span class="toast-bar absolute bottom-0 left-0 h-1 w-full" [class]="styles[t.kind].bar" [style.animation-duration.ms]="t.duration"></span>
        </div>
      }
    </div>
  `,
})
export class Toasts {
  readonly toast = inject(ToastService);

  readonly styles: Record<ToastKind, { border: string; icon: string; bar: string }> = {
    success: { border: 'border-emerald-200', icon: 'bg-emerald-600', bar: 'bg-emerald-500' },
    error: { border: 'border-red-200', icon: 'bg-red-600', bar: 'bg-red-500' },
    info: { border: 'border-sky-200', icon: 'bg-sky-600', bar: 'bg-sky-500' },
  };
}