import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  template: `
    @if (visible()) {
      <button
        type="button"
        (click)="toTop()"
        aria-label="Back to top"
        class="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg transition hover:bg-emerald-600"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    }
  `,
})
export class ScrollTop {
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.visible.set(window.scrollY > 400);
  }

  toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}