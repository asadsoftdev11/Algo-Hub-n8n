import { Component, HostListener, inject } from '@angular/core';
import { ConfirmService } from '../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (confirm.options(); as o) {
      <div class="fixed inset-0 z-60 flex items-center justify-center p-4">
        <button type="button" (click)="confirm.answer(false)" aria-label="Close" class="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-sm"></button>
        <div class="pop relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
          <h3 id="confirm-title" class="text-lg font-bold text-slate-900">{{ o.title }}</h3>
          <p id="confirm-message" class="mt-2 text-sm text-slate-600">{{ o.message }}</p>
          <div class="mt-6 flex justify-end gap-2">
            <button type="button" (click)="confirm.answer(false)" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">{{ o.cancelText ?? 'Cancel' }}</button>
            <button type="button" (click)="confirm.answer(true)" class="rounded-lg px-4 py-2 text-sm font-semibold text-white transition" [class]="o.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'">{{ o.confirmText ?? 'Confirm' }}</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialog {
  readonly confirm = inject(ConfirmService);

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.confirm.options()) this.confirm.answer(false);
  }
}