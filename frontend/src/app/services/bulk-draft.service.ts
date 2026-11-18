import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { AuthService } from './auth.service';
import { Platform } from './posts.service';

export type BulkStep = 'upload' | 'check' | 'generating' | 'review' | 'done';
export type BulkDecision = 'waiting' | 'approved' | 'discarded';

export interface BulkRawRow {
  id: number;
  line: number;
  topic: string;
  date: string;
  time: string;
  caption: string;
  platforms: Platform[] | null;
}

export interface BulkCheckedRow extends BulkRawRow {
  chosen: Platform[];
  errors: string[];
}

export interface BulkEditBuffer {
  topic: string;
  date: string;
  time: string;
  platforms: Platform[];
}

export interface BulkItem {
  row: BulkCheckedRow;
  caption: string;
  decision: BulkDecision;
  busy: boolean;
  edit: BulkEditBuffer | null;
  editError: string;
}

@Injectable({ providedIn: 'root' })
export class BulkDraftService {
  private auth = inject(AuthService);

  step = signal<BulkStep>('upload');
  fileName = signal('');
  rows = signal<BulkRawRow[]>([]);
  defaultPlatforms = signal<Platform[]>([]);
  items = signal<BulkItem[]>([]);
  progress = signal(0);
  result = signal({ scheduled: 0, drafts: 0, discarded: 0 });
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  runId = 0;

  private owner = computed(() => this.auth.user()?.email ?? null);

  constructor() {
    effect(() => {
      this.owner();
      untracked(() => this.reset());
    });
  }

  reset() {
    this.runId++;
    this.step.set('upload');
    this.fileName.set('');
    this.rows.set([]);
    this.defaultPlatforms.set([]);
    this.items.set([]);
    this.progress.set(0);
    this.result.set({ scheduled: 0, drafts: 0, discarded: 0 });
    this.timezone = this.auth.user()?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}