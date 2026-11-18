import { Component, computed, input } from '@angular/core';

const PATHS: Record<string, string> = {
  check: 'M5 13l4 4L19 7',
  close: 'M18 6L6 18M6 6l12 12',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  edit: 'M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  undo: 'M1 4v6h6M3.51 15a9 9 0 102.13-9.36L1 10',
  back: 'M19 12H5M12 19l-7-7 7-7',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
};

@Component({
  selector: 'app-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      [style.width.px]="size()"
      [style.height.px]="size()"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
})
export class Icon {
  name = input.required<string>();
  size = input(16);
  path = computed(() => PATHS[this.name()] ?? '');
}