import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { Platform, PostRequest, PostsService, PublishMode } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';

type Step = 'form' | 'review' | 'progress' | 'done';

@Component({
  selector: 'app-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './create.html',
})
export class Create {
  private postsService = inject(PostsService);
  private accountsService = inject(AccountsService);
  private auth = inject(AuthService);

  readonly stepLabels = ['Create', 'Review', 'Publish'];
  readonly today = new Date().toISOString().slice(0, 10);
  readonly timezones = Intl.supportedValuesOf('timeZone');

  title = '';
  caption = '';
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
  stages = signal<string[]>([]);
  currentStage = signal(0);
  errorMessage = signal('');

  get stepIndex() {
    if (this.step() === 'form') return 0;
    if (this.step() === 'review') return 1;
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

  goToReview() {
    if (!this.isValid) return;
    this.errorMessage.set('');
    this.step.set('review');
  }

  backToEdit() {
    this.step.set('form');
  }

  async confirm() {
    const request: PostRequest = {
      title: this.title.trim(),
      caption: this.caption.trim(),
      platforms: this.selectedPlatforms,
      publishMode: this.publishMode,
      scheduledAt: this.publishMode === 'schedule' ? `${this.scheduleDate}T${this.scheduleTime}` : null,
      timezone: this.timezone,
    };

    this.errorMessage.set('');
    this.stages.set(this.postsService.stagesFor(request.publishMode));
    this.currentStage.set(0);
    this.step.set('progress');

    try {
      await this.postsService.submit(request, (i) => this.currentStage.set(i));
      this.currentStage.set(this.stages().length);
      this.step.set('done');
    } catch {
      this.errorMessage.set('We could not send your post. Please try again.');
      this.step.set('review');
    }
  }

  createAnother() {
    this.title = '';
    this.caption = '';
    this.publishMode = 'now';
    this.scheduleDate = '';
    this.scheduleTime = '';
    this.platforms.forEach((p) => (p.selected = false));
    this.step.set('form');
  }

  badge(i: number) {
    if (i < this.currentStage()) return 'bg-emerald-600 text-white';
    if (i === this.currentStage()) return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-400';
  }
}