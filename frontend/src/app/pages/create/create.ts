import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { AuthService } from '../../services/auth.service';
import { Platform, PostRequest, PostsService, PreviewResult, PublishMode } from '../../services/posts.service';

type Step = 'form' | 'generating' | 'preview' | 'publishing' | 'done';
type Outcome = 'sent' | 'scheduled' | 'draft';

@Component({
  selector: 'app-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './create.html',
})
export class Create {
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
    this.errorMessage.set('');
    this.preview.set(null);
    this.stages.set(this.postsService.generationStages);
    this.currentStage.set(0);
    this.step.set('generating');

    try {
      const result = await this.postsService.generatePreview(this.buildRequest(this.caption.trim()), (i) => this.currentStage.set(i));
      this.preview.set(result);
      this.finalCaption = result.caption;
      this.step.set('preview');
    } catch {
      this.errorMessage.set('We could not create your video. Please try again.');
      this.step.set('form');
    }
  }

  async approve() {
    const request = this.buildRequest(this.finalCaption.trim());
    this.errorMessage.set('');
    this.stages.set(this.postsService.publishStagesFor(request.publishMode));
    this.currentStage.set(0);
    this.step.set('publishing');

    try {
      await this.postsService.publish(request, (i) => this.currentStage.set(i));
      this.outcome.set(request.publishMode === 'now' ? 'sent' : 'scheduled');
      this.step.set('done');
    } catch {
      this.errorMessage.set('We could not send your post. Please try again.');
      this.step.set('preview');
    }
  }

  saveDraft() {
    this.postsService.saveDraft(this.buildRequest(this.finalCaption.trim()));
    this.outcome.set('draft');
    this.step.set('done');
  }

  editIdea() {
    this.errorMessage.set('');
    this.step.set('form');
  }

  discard() {
    const ok = confirm('Discard this video? It will not be saved or published.');
    if (ok) this.createAnother();
  }

  createAnother() {
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