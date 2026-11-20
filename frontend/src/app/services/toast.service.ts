import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  duration: number;
}

const MUTE_KEY = 'autosocial_sound_muted';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  readonly muted = signal(this.readMuted());

  private nextId = 1;
  private audio: AudioContext | null = null;

  success(message: string) {
    this.show('success', message, 4000);
  }

  info(message: string) {
    this.show('info', message, 4000);
  }

  error(message: string) {
    this.show('error', message, 6000);
  }

  dismiss(id: number) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  toggleMute() {
    const next = !this.muted();
    this.muted.set(next);
    try {
      localStorage.setItem(MUTE_KEY, String(next));
    } catch {}
    if (!next) this.playSound('info');
  }

  private show(kind: ToastKind, message: string, duration: number) {
    const id = this.nextId++;
    this.toasts.update((list) => [...list.slice(-2), { id, kind, message, duration }]);
    this.playSound(kind);
    setTimeout(() => this.dismiss(id), duration);
  }

  private playSound(kind: ToastKind) {
    if (this.muted()) return;
    try {
      this.audio ??= new AudioContext();
      const context = this.audio;
      if (context.state === 'suspended') void context.resume();

      const notes = kind === 'error' ? [330, 247] : kind === 'success' ? [660, 880] : [740];
      notes.forEach((frequency, index) => {
        const start = context.currentTime + index * 0.11;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.07, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.32);
      });
    } catch {}
  }

  private readMuted() {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  }
}