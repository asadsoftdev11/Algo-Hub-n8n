import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly options = signal<ConfirmOptions | null>(null);
  private resolver: ((value: boolean) => void) | null = null;

  ask(options: ConfirmOptions): Promise<boolean> {
    this.resolver?.(false);
    this.options.set(options);
    return new Promise((resolve) => (this.resolver = resolve));
  }

  answer(value: boolean) {
    this.resolver?.(value);
    this.resolver = null;
    this.options.set(null);
  }
}