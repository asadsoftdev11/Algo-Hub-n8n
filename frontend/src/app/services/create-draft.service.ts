import { Injectable, effect, inject, untracked } from '@angular/core';
import { AuthService } from './auth.service';
import { Platform, PreviewResult, PublishMode } from './posts.service';

export interface CreateSnapshot {
  title: string;
  caption: string;
  finalCaption: string;
  publishMode: PublishMode;
  scheduleDate: string;
  scheduleTime: string;
  timezone: string;
  selected: Platform[];
  step: 'form' | 'preview';
  preview: PreviewResult | null;
  ideaAtPreview: string;
  editingId: number | null;
}

@Injectable({ providedIn: 'root' })
export class CreateDraftService {
  private auth = inject(AuthService);

  snapshot: CreateSnapshot | null = null;

  constructor() {
    effect(() => {
      this.auth.user();
      untracked(() => (this.snapshot = null));
    });
  }
}