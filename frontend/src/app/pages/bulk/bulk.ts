import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { AuthService } from '../../services/auth.service';
import {
  BulkCheckedRow,
  BulkDecision,
  BulkDraftService,
  BulkItem,
  BulkRawRow,
} from '../../services/bulk-draft.service';
import { Platform, PostRequest, PostsService } from '../../services/posts.service';
import { parseCsv } from '../../shared/csv';
import { Icon } from '../../shared/icon';
import { PlatformIcon } from '../../shared/platform-icon';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { LimitsService } from '../../services/limits.service';
import { Reveal } from '../../shared/reveal.directive';


type RowField = 'topic' | 'date' | 'time';

const MAX_ROWS = 50;
const ALL_PLATFORMS: Platform[] = ['TikTok', 'Instagram', 'Facebook', 'LinkedIn'];

@Component({
  selector: 'app-bulk',
  imports: [FormsModule, RouterLink, Icon, PlatformIcon, Reveal],
  templateUrl: './bulk.html',
})
export class Bulk {
  private postsService = inject(PostsService);
  private accountsService = inject(AccountsService);
  readonly auth = inject(AuthService);
  readonly state = inject(BulkDraftService);
  private toast = inject(ToastService);
  private dialog = inject(ConfirmService);
  readonly limits = inject(LimitsService);

  readonly stepLabels = ['Upload', 'Check', 'Review'];
  readonly timezones = Intl.supportedValuesOf('timeZone');
  readonly allPlatforms = ALL_PLATFORMS;
  readonly maxRows = MAX_ROWS;
  readonly today = new Date().toLocaleDateString('en-CA');

  readonly step = this.state.step;
  readonly fileName = this.state.fileName;
  readonly rows = this.state.rows;
  readonly defaultPlatforms = this.state.defaultPlatforms;
  readonly items = this.state.items;
  readonly progress = this.state.progress;
  readonly result = this.state.result;

  errorMessage = signal('');
  saving = signal(false);

  constructor() {
    if (this.step() !== 'upload') this.toast.info('Your bulk work was kept');
  }

  checkedRows = computed<BulkCheckedRow[]>(() =>
    this.rows().map((row) => {
      const chosen = (row.platforms ?? this.defaultPlatforms()).filter((p) => this.isConnected(p));
      return { ...row, chosen, errors: this.validate(row) };
    }),
  );
  validRows = computed(() => this.checkedRows().filter((r) => r.errors.length === 0));
  invalidCount = computed(() => this.checkedRows().length - this.validRows().length);
  missingPlatformCount = computed(() => this.validRows().filter((r) => r.chosen.length === 0).length);
  approvedCount = computed(() => this.items().filter((i) => i.decision === 'approved').length);
  waitingCount = computed(() => this.items().filter((i) => i.decision === 'waiting').length);
  discardedCount = computed(() => this.items().filter((i) => i.decision === 'discarded').length);
  anyBusy = computed(() => this.items().some((i) => i.busy));

  get stepIndex() {
    if (this.step() === 'upload') return 0;
    if (this.step() === 'check') return 1;
    return 2;
  }

  get canCreatePreviews() {
    return this.validRows().length > 0 && this.missingPlatformCount() === 0;
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

  updateRow(id: number, field: RowField, value: string) {
    this.rows.update((list) =>
      list.map((row) => {
        if (row.id !== id) return row;
        const next: BulkRawRow = { ...row };
        next[field] = value;
        return next;
      }),
    );
  }

  toggleDefault(name: Platform) {
    this.defaultPlatforms.update((list) => (list.includes(name) ? list.filter((p) => p !== name) : [...list, name]));
  }

  toggleRowPlatform(row: BulkCheckedRow, name: Platform) {
    const next = row.chosen.includes(name) ? row.chosen.filter((p) => p !== name) : [...row.chosen, name];
    this.rows.update((list) => list.map((r) => (r.id === row.id ? { ...r, platforms: next } : r)));
  }

  applyDefaultToAll() {
    this.rows.update((list) => list.map((r) => ({ ...r, platforms: null })));
  }

  removeRow(id: number) {
    this.rows.update((list) => list.filter((r) => r.id !== id));
  }

  removeInvalidRows() {
    const bad = new Set(this.checkedRows().filter((r) => r.errors.length > 0).map((r) => r.id));
    this.rows.update((list) => list.filter((r) => !bad.has(r.id)));
  }

  async createPreviews() {
   const rows = this.validRows();
    if (!this.canCreatePreviews) return;

    if (rows.length > this.limits.videosLeft()) {
      this.errorMessage.set(`You have ${this.limits.videosLeft()} videos left this month. Remove some rows or upgrade your plan.`);
      return;
    }
    this.limits.useVideos(rows.length);
    const run = ++this.state.runId;
    this.errorMessage.set('');
    this.progress.set(0);
    this.step.set('generating');

    try {
      const created: BulkItem[] = [];
      for (const row of rows) {
        const preview = await this.postsService.generateQuickPreview(this.buildRequest(row, row.caption));
        if (run !== this.state.runId) return;
        created.push({ row, caption: preview.caption, decision: 'waiting', busy: false, edit: null, editError: '' });
        this.progress.set(created.length);
      }
      this.items.set(created);
      this.step.set('review');
    } catch {
      if (run !== this.state.runId) return;
      this.errorMessage.set('We could not create the video previews. Please try again.');
      this.step.set('check');
    }
  }

  cancelGeneration() {
    this.state.runId++;
    this.step.set('check');
  }

  async backToCheck() {
        if (this.items().length > 0) {
      const ok = await this.dialog.ask({
        title: 'Go back?',
        message: 'Going back will discard your review choices.',
        confirmText: 'Go back',
        cancelText: 'Stay here',
        danger: true,
      });
      if (!ok) return;
    }
    this.items.set([]);
    this.step.set('check');
  }

  setDecision(id: number, decision: BulkDecision) {
    this.patchItem(id, { decision });
  }

  approveRemaining() {
    this.items.update((list) =>
      list.map((item) => (item.decision === 'waiting' && !item.busy ? { ...item, decision: 'approved' } : item)),
    );
  }

  async regenerateItem(id: number, keepCaption = true) {
    const item = this.items().find((i) => i.row.id === id);
     if (!item || item.busy) return;
    if (this.limits.videosLeft() < 1) {
      this.toast.error('You have used all your videos this month. Upgrade your plan to create more.');
      return;
    }
    this.limits.useVideos();

    this.patchItem(id, { busy: true, edit: null, editError: '' });
    try {
      const caption = keepCaption ? item.caption.trim() : '';
      const preview = await this.postsService.generateQuickPreview(this.buildRequest(item.row, caption));
      this.patchItem(id, { busy: false, decision: 'waiting', caption: preview.caption });
      this.toast.success('A new video was created');
    } catch {
      this.patchItem(id, { busy: false });
      this.errorMessage.set('We could not create a new video. Please try again.');
    }
  }

  startEdit(id: number) {
    const item = this.items().find((i) => i.row.id === id);
    if (!item) return;
    this.patchItem(id, {
      edit: { topic: item.row.topic, date: item.row.date, time: item.row.time, platforms: [...item.row.chosen] },
      editError: '',
    });
  }

  cancelEdit(id: number) {
    this.patchItem(id, { edit: null, editError: '' });
  }

  toggleEditPlatform(item: BulkItem, name: Platform) {
    if (!item.edit) return;
    const list = item.edit.platforms;
    const next = list.includes(name) ? list.filter((p) => p !== name) : [...list, name];
    this.patchItem(item.row.id, { edit: { ...item.edit, platforms: next } });
  }

  async saveEdit(id: number) {
    const item = this.items().find((i) => i.row.id === id);
    const edit = item?.edit;
    if (!item || !edit) return;

    const errors = this.validate({ ...item.row, topic: edit.topic, date: edit.date, time: edit.time });
    if (edit.platforms.length === 0) errors.push('Choose at least one platform');
    if (errors.length > 0) {
      this.patchItem(id, { editError: errors.join('. ') });
      return;
    }

    const topicChanged = edit.topic.trim() !== item.row.topic.trim();
    const row: BulkCheckedRow = {
      ...item.row,
      topic: edit.topic.trim(),
      date: edit.date,
      time: edit.time,
      platforms: edit.platforms,
      chosen: edit.platforms,
      errors: [],
    };
    this.patchItem(id, { row, edit: null, editError: '' });

    if (topicChanged) await this.regenerateItem(id, false);
  }

  async finish() {
    const items = this.items();
    const approved = items.filter((i) => i.decision === 'approved');
    const waiting = items.filter((i) => i.decision === 'waiting');
    if (approved.length > this.limits.scheduledLeft()) {
      this.errorMessage.set(`Your plan allows ${this.limits.limit().scheduled} scheduled posts at a time (${this.limits.scheduledLeft()} left). Approve fewer videos or upgrade your plan.`);
      return;
    }

    const discarded = this.discardedCount();
    const ok = await this.dialog.ask({
      title: approved.length === 0 ? 'Nothing is approved' : 'Schedule these posts?',
      message:
        approved.length === 0
          ? `No video is approved, so nothing will be scheduled. ${waiting.length} will be saved as drafts and ${discarded} discarded.`
          : `${approved.length} will be scheduled, ${waiting.length} saved as drafts and ${discarded} discarded. Discarded videos cannot be recovered.`,
      confirmText: approved.length === 0 ? 'Save as drafts' : 'Schedule',
      cancelText: 'Go back and review',
    });
    if (!ok) return;

    this.saving.set(true);
    this.errorMessage.set('');
    try {
      if (approved.length > 0) {
        await this.postsService.scheduleMany(approved.map((i) => this.buildRequest(i.row, i.caption.trim())));
      }
      waiting.forEach((i) => this.postsService.saveDraft(this.buildRequest(i.row, i.caption.trim())));
      this.result.set({ scheduled: approved.length, drafts: waiting.length, discarded: this.discardedCount() });
      this.step.set('done');
      this.toast.success(approved.length === 1 ? '1 post scheduled' : `${approved.length} posts scheduled`);
    } catch {
      this.errorMessage.set('We could not schedule your posts. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  startOver() {
    this.state.reset();
    this.errorMessage.set('');
  }

  backToUpload() {
    this.rows.set([]);
    this.fileName.set('');
    this.errorMessage.set('');
    this.step.set('upload');
  }

  private patchItem(id: number, patch: Partial<BulkItem>) {
    this.items.update((list) => list.map((item) => (item.row.id === id ? { ...item, ...patch } : item)));
  }

  private buildRow(index: number, cells: string[], columns: string[]): BulkRawRow {
    const read = (name: string) => (cells[columns.indexOf(name)] ?? '').trim();
    return {
      id: index + 1,
      line: index + 2,
      topic: read('topic'),
      date: read('date'),
      time: read('time'),
      caption: read('caption'),
      platforms: null,
    };
  }

  private validate(row: BulkRawRow): string[] {
    const errors: string[] = [];
    const topic = row.topic.trim();
    if (topic.length < 5) errors.push('Topic needs at least 5 characters');
    if (topic.length > 200) errors.push('Topic is longer than 200 characters');
    if (!this.isRealDate(row.date)) errors.push('Choose a valid date');
    else if (row.date < this.today) errors.push('Date is in the past');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(row.time)) errors.push('Choose a valid time');
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

  private buildRequest(row: BulkCheckedRow, caption: string): PostRequest {
    return {
      title: row.topic.trim(),
      caption,
      platforms: row.chosen,
      publishMode: 'schedule',
      scheduledAt: `${row.date}T${row.time}`,
      timezone: this.state.timezone,
    };
  }
}