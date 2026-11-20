import { Component, computed, input, signal } from '@angular/core';

interface DayCell {
  iso: string;
  day: number;
  inMonth: boolean;
  today: boolean;
  marked: boolean;
}

@Component({
  selector: 'app-mini-calendar',
  template: `
    <div class="w-full rounded-xl p-4" [class]="dark() ? 'bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md' : 'border border-slate-200 bg-white text-slate-900'">
      <div class="flex items-center justify-between">
        <button type="button" (click)="previous()" aria-label="Previous month" [class]="arrowClass()">
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" (click)="goToday()" class="text-sm font-semibold" title="Go to today">{{ monthLabel() }}</button>
        <button type="button" (click)="next()" aria-label="Next month" [class]="arrowClass()">
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div class="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium" [class]="dark() ? 'text-emerald-100/70' : 'text-slate-400'">
        @for (d of weekdays; track d) {
          <span>{{ d }}</span>
        }
      </div>

      <div class="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
        @for (c of cells(); track c.iso) {
          <div
            class="relative flex h-8 items-center justify-center rounded-lg transition"
            [class]="cellClass(c)"
            [attr.title]="c.marked ? 'Post scheduled' : null"
          >
            {{ c.day }}
          </div>
        }
      </div>

      <p class="mt-3 text-[11px]" [class]="dark() ? 'text-emerald-100/80' : 'text-slate-500'">
        {{ markedCount() === 0 ? 'No posts scheduled this month' : markedCount() + (markedCount() === 1 ? ' day' : ' days') + ' with scheduled posts' }}
      </p>
    </div>
  `,
})
export class MiniCalendar {
  marked = input<string[]>([]);
  tone = input<'light' | 'dark'>('light');

  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  private view = signal(this.monthStart(new Date()));

  dark = computed(() => this.tone() === 'dark');

  monthLabel = computed(() => this.view().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

  cells = computed<DayCell[]>(() => {
    const first = this.view();
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);
    const todayIso = this.iso(new Date());
    const marked = new Set(this.marked());

    const all = Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const iso = this.iso(date);
      return {
        iso,
        day: date.getDate(),
        inMonth: date.getMonth() === first.getMonth(),
        today: iso === todayIso,
        marked: marked.has(iso),
      };
    });
    return all[35].inMonth ? all : all.slice(0, 35);
  });

  markedCount = computed(() => this.cells().filter((c) => c.marked && c.inMonth).length);

  previous() {
    const v = this.view();
    this.view.set(new Date(v.getFullYear(), v.getMonth() - 1, 1));
  }

  next() {
    const v = this.view();
    this.view.set(new Date(v.getFullYear(), v.getMonth() + 1, 1));
  }

  goToday() {
    this.view.set(this.monthStart(new Date()));
  }

  arrowClass() {
    return this.dark() ? 'rounded-lg p-1.5 text-white hover:bg-white/15' : 'rounded-lg p-1.5 text-slate-600 hover:bg-slate-100';
  }

  cellClass(c: DayCell) {
    const dark = this.dark();
    if (c.marked && c.inMonth) {
      return (dark ? 'bg-accent-300 font-bold text-emerald-900' : 'bg-emerald-100 font-semibold text-emerald-800') + (c.today ? (dark ? ' ring-2 ring-white' : ' ring-2 ring-emerald-500') : '');
    }
    if (c.today) {
      return dark ? 'font-bold text-white ring-2 ring-accent-300' : 'font-bold text-emerald-800 ring-2 ring-emerald-500';
    }
    if (!c.inMonth) {
      return dark ? 'text-white/30' : 'text-slate-300';
    }
    return dark ? 'text-white/90 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100';
  }

  private monthStart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private iso(date: Date) {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
  }
}