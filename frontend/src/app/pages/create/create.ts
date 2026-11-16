import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { AuthService } from '../../services/auth.service';
import { PendingEdit, Platform, PostRequest, PostsService, PreviewResult, PublishMode } from '../../services/posts.service';

type Step = 'form' | 'generating' | 'preview' | 'publishing' | 'done';
type Outcome = 'sent' | 'scheduled' | 'draft';

@Component({
  selector: 'app-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './create.html',
})
export class Create {
  private router = inject(Router);
  private postsService = inject(PostsService);
  private accountsService = inject(AccountsService);
  private auth = inject(AuthService);

  readonly stepLabels = ['Create', 'Review video', 'Publish'];
  readonly today = new Date().toISOString().slice(0, 10);
  readonly timezones = Intl.supportedValuesOf('timeZone');

  title = '';
  caption = '';
  finalCaption = '';
  publishMode: PublishMode = 'now';
  scheduleDate = '';
  scheduleTime = '';
  timezone = this.auth.user()?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  platforms: { name: Platform; selected: boolean }[] = [
    { name: 'TikTok', selected: false },
    { name: 'Instagram', selected: false },
    { name: 'Facebook', selected: false },
    { name: 'LinkedIn', selected: false },
  ];

  step = signal<Step>('form');
  outcome = signal<Outcome>('sent');
  preview = signal<PreviewResult | null>(null);
  stages = signal<string[]>([]);
  currentStage = signal(0);
  errorMessage = signal('');

  private editingId: number | null = null;
  private runId = 0;

  constructor() {
    const pending = this.postsService.takePendingEdit();
    if (pending) this.loadEdit(pending);
  }

  get editing() {
    return this.editingId !== null;
  }

  get stepIndex() {
    if (this.step() === 'form') return 0;
    if (this.step() === 'generating' || this.step() === 'preview') return 1;
    return 2;
  }

  get selectedPlatforms(): Platform[] {
    return this.platforms.filter((p) => p.selected && this.isConnected(p.name)).map((p) => p.name);
  }

  get isValid() {
    const hasIdea = this.title.trim().length >= 5;
    const hasPlatform = this.selectedPlatforms.length > 0;
    const hasSchedule = this.publishMode === 'now' || (!!this.scheduleDate && !!this.scheduleTime);
    return hasIdea && hasPlatform && hasSchedule;
  }

  isConnected(name: Platform) {
    return this.accountsService.isConnected(name);
  }

  async createPreview() {
    if (!this.isValid) return;
    const run = ++this.runId;
    this.errorMessage.set('');
    this.preview.set(null);
    this.stages.set(this.postsService.generationStages);
    this.currentStage.set(0);
    this.step.set('generating');

    try {
      const result = await this.postsService.generatePreview(this.buildRequest(this.caption.trim()), (i) => {
        if (run === this.runId) this.currentStage.set(i);
      });
      if (run !== this.runId) return;
      this.preview.set(result);
      this.finalCaption = result.caption;
      this.step.set('preview');
    } catch {
      if (run !== this.runId) return;
      this.errorMessage.set('We could not create your video. Please try again.');
      this.step.set('form');
    }
  }

  cancelGeneration() {
    this.runId++;
    this.step.set('form');
  }

  async approve() {
    const request = this.buildRequest(this.finalCaption.trim());
    this.errorMessage.set('');
    this.stages.set(this.postsService.publishStagesFor(request.publishMode));
    this.currentStage.set(0);
    this.step.set('publishing');

    try {
      await this.postsService.publish(request, (i) => this.currentStage.set(i), this.saveOptions());
      this.outcome.set(request.publishMode === 'now' ? 'sent' : 'scheduled');
      this.step.set('done');
    } catch {
      this.errorMessage.set('We could not send your post. Please try again.');
      this.step.set('preview');
    }
  }

  saveDraft() {
    this.postsService.saveDraft(this.buildRequest(this.finalCaption.trim()), this.saveOptions());
    this.outcome.set('draft');
    this.step.set('done');
  }

  editDetails() {
    this.errorMessage.set('');
    this.step.set('form');
  }

  discard() {
    const message = this.editing
      ? 'Leave without saving? The saved post stays as it was.'
      : 'Discard this video? It will not be saved or published.';
    if (!confirm(message)) return;

    const wasEditing = this.editing;
    this.createAnother();
    if (wasEditing) this.router.navigate(['/app/posts']);
  }

  createAnother() {
    this.runId++;
    this.editingId = null;
    this.title = '';
    this.caption = '';
    this.finalCaption = '';
    this.publishMode = 'now';
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.platforms.forEach((p) => (p.selected = false));
    this.preview.set(null);
    this.errorMessage.set('');
    this.step.set('form');
  }

  badge(i: number) {
    if (i < this.currentStage()) return 'bg-emerald-600 text-white';
    if (i === this.currentStage()) return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-400';
  }

  private loadEdit(edit: PendingEdit) {
    const { request } = edit;
    const [date = '', time = ''] = (request.scheduledAt ?? '').split('T');

    this.title = request.title;
    this.caption = request.caption;
    this.finalCaption = request.caption;
    this.publishMode = request.publishMode;
    this.scheduleDate = date;
    this.scheduleTime = time;
    this.timezone = request.timezone;
    this.platforms.forEach((p) => (p.selected = request.platforms.includes(p.name)));
    this.editingId = edit.replaceId;
    this.preview.set({ videoUrl: edit.videoUrl, caption: request.caption });
    this.step.set(edit.startAt);
  }

  private saveOptions() {
    return { replaceId: this.editingId, videoUrl: this.preview()?.videoUrl ?? null };
  }

  private buildRequest(caption: string): PostRequest {
    return {
      title: this.title.trim(),
      caption,
      platforms: this.selectedPlatforms,
      publishMode: this.publishMode,
      scheduledAt: this.publishMode === 'schedule' ? `${this.scheduleDate}T${this.scheduleTime}` : null,
      timezone: this.timezone,
    };
  }
}