import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({ selector: '[appCountUp]' })
export class CountUp {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private shown = 0;

  value = input.required<number>({ alias: 'appCountUp' });

  constructor() {
    effect(() => this.animateTo(this.value()));
  }

  private animateTo(target: number) {
    const element = this.el.nativeElement;
    const start = this.shown;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || start === target) {
      this.shown = target;
      element.textContent = String(target);
      return;
    }

    const duration = 700;
    const began = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - began) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.shown = Math.round(start + (target - start) * eased);
      element.textContent = String(this.shown);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}