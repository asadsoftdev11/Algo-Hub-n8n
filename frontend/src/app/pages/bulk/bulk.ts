import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { AuthService } from '../../services/auth.service';
import { Platform, PostRequest, PostsService } from '../../services/posts.service';
import { parseCsv } from '../../shared/csv';

type Step = 'upload' | 'check' | 'generating' | 'review' | 'done';
type Decision = 'waiting' | 'approved' | 'discarded';

interface BulkRow {
  id: number;
  line: number;
  topic: string;
  date: string;
  time: string;
  caption: string;
  errors: string[];
}

interface BulkItem {
  row: BulkRow;
  caption: string;
  decision: Decision;
}

const MAX_ROWS = 50;

@Component({
  selector: 'app-bulk',
  imports: [FormsModule, RouterLink],
  templateUrl: './bulk.html',
})
export class Bulk {
  private postsService = inject(PostsService);
  private accountsService = inject(AccountsService);
  private auth = inject(AuthService);

  readonly stepLabels = ['Upload', 'Check', 'Review'];
  readonly timezones = Intl.supportedValuesOf('timeZone');
  readonly maxRows = MAX_ROWS;
  readonly today = new Date().toLocaleDateString('en-CA');

  platforms: { name: Platform; selected: boolean }[] = [
    { name: 'TikTok', selected: false },
    { name: 'Instagram', selected: false },
    { name: 'Facebook', selected: false },
    { name: 'LinkedIn', selected: false },
  ];
  timezone = this.auth.user()?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  step = signal<Step>('upload');
  fileName = signal('');
  errorMessage = signal('');
  rows = signal<BulkRow[]>([]);
  items = signal<BulkItem[]>([]);
  progress = signal(0);
  saving = signal(false);
  result = signal({ scheduled: 0, drafts: 0, discarded: 0 });

  validRows = computed(() => this.rows().filter((r) => r.errors.length === 0));
  invalidCount = computed(() => this.rows().length - this.validRows().length);
  approvedCount = computed(() => this.items().filter((i) => i.decision === 'approved').length);
  waitingCount = computed(() => this.items().filter((i) => i.decision === 'waiting').length);
  discardedCount = computed(() => this.items().filter((i) => i.decision === 'discarded').length);

  get stepIndex() {
    if (this.step() === 'upload') return 0;
    if (this.step() === 'check') return 1;
    return 2;
  }

  get selectedPlatforms(): Platform[] {
    return this.platforms.filter((p) => p.selected && this.isConnected(p.name)).map((p) => p.name);
  }

  get canCreatePreviews() {
    return this.validRows().length > 0 && this.selectedPlatforms.length > 0;
  }

  isConnected(name: Platform) {
    return this.accountsService.isConnected(name);
  }

  async onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.errorMessage.set('');
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv') || file.size > 1024 * 1024) {
      this.errorMessage.set('Please choose a .csv file smaller than 1 MB.');
      input.value = '';
      return;
    }

    const [header, ...body] = parseCsv(await file.text());
    const columns = (header ?? []).map((c) => c.trim().toLowerCase());

    if (!['topic', 'date', 'time'].every((name) => columns.includes(name))) {
      this.errorMessage.set('The first row must contain these column names: topic, date, time. A caption column is optional.');
      input.value = '';
      return;
    }
    if (body.length === 0) {
      this.errorMessage.set('The file has no rows below the column names.');
      input.value = '';
      return;
    }
    if (body.length > MAX_ROWS) {
      this.errorMessage.set(`Please upload at most ${MAX_ROWS} rows at a time.`);
      input.value = '';
      return;
    }

    this.rows.set(body.map((cells, index) => this.buildRow(index, cells, columns)));
    this.fileName.set(file.name);
    this.step.set('check');
    input.value = '';
  }

  downloadTemplate() {
    const sample = [
      'topic,date,time,caption',
      `5 daily habits for a productive morning,${this.daysFromNow(1)},10:30,`,
      `Three tips for better customer service,${this.daysFromNow(2)},14:00,"Great service builds loyalty, one customer at a time."`,
    ].join('\n');

    const url = URL.createObjectURL(new Blob([sample], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autosocial-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  removeRow(id: number) {
    this.rows.update((list) => list.filter((r) => r.id !== id));
  }

  removeInvalidRows() {
    this.rows.update((list) => list.filter((r) => r.errors.length === 0));
  }

  async createPreviews() {
    const rows = this.validRows();
    if (!this.canCreatePreviews) return;

    this.errorMessage.set('');
    this.progress.set(0);
    this.step.set('generating');

    try {
      const created: BulkItem[] = [];
      for (const row of rows) {
        const preview = await this.postsService.generateQuickPreview(this.buildRequest(row, row.caption));
        created.push({ row, caption: preview.caption, decision: 'waiting' });
        this.progress.set(created.length);
      }
      this.items.set(created);
      this.step.set('review');
    } catch {
      this.errorMessage.set('We could not create the video previews. Please try again.');
      this.step.set('check');
    }
  }

  setDecision(id: number, decision: Decision) {
    this.items.update((list) => list.map((item) => (item.row.id === id ? { ...item, decision } : item)));
  }

  approveRemaining() {
    this.items.update((list) => list.map((item) => (item.decision === 'waiting' ? { ...item, decision: 'approved' } : item)));
  }

  async finish() {
    const items = this.items();
    const approved = items.filter((i) => i.decision === 'approved');
    const waiting = items.filter((i) => i.decision === 'waiting');

    this.saving.set(true);
    this.errorMessage.set('');
    try {
      if (approved.length > 0) {
        await this.postsService.scheduleMany(approved.map((i) => this.buildRequest(i.row, i.caption.trim())));
      }
      waiting.forEach((i) => this.postsService.saveDraft(this.buildRequest(i.row, i.caption.trim())));
      this.result.set({ scheduled: approved.length, drafts: waiting.length, discarded: this.discardedCount() });
      this.step.set('done');
    } catch {
      this.errorMessage.set('We could not schedule your posts. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  startOver() {
    this.rows.set([]);
    this.items.set([]);
    this.fileName.set('');
    this.errorMessage.set('');
    this.platforms.forEach((p) => (p.selected = false));
    this.step.set('upload');
  }

  backToUpload() {
    this.rows.set([]);
    this.fileName.set('');
    this.errorMessage.set('');
    this.step.set('upload');
  }

  private buildRow(index: number, cells: string[], columns: string[]): BulkRow {
    const read = (name: string) => (cells[columns.indexOf(name)] ?? '').trim();
    const row: BulkRow = {
      id: index + 1,
      line: index + 2,
      topic: read('topic'),
      date: read('date'),
      time: read('time'),
      caption: read('caption'),
      errors: [],
    };
    row.errors = this.validate(row);
    return row;
  }

  private validate(row: BulkRow): string[] {
    const errors: string[] = [];
    if (row.topic.length < 5) errors.push('Topic needs at least 5 characters');
    if (row.topic.length > 200) errors.push('Topic is longer than 200 characters');
    if (!this.isRealDate(row.date)) errors.push('Date must look like 2026-12-31');
    else if (row.date < this.today) errors.push('Date is in the past');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(row.time)) errors.push('Time must look like 14:30');
    if (row.caption.length > 2200) errors.push('Caption is too long');
    return errors;
  }

  private isRealDate(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  private daysFromNow(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-CA');
  }

  private buildRequest(row: BulkRow, caption: string): PostRequest {
    return {
      title: row.topic,
      caption,
      platforms: this.selectedPlatforms,
      publishMode: 'schedule',
      scheduledAt: `${row.date}T${row.time}`,
      timezone: this.timezone,
    };
  }
}