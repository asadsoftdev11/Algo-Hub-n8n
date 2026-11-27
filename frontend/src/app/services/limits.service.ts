import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { PLAN_LIMITS } from '../shared/plan-limits';
import { AccountsService } from './accounts.service';
import { AuthService } from './auth.service';
import { PostsService } from './posts.service';

@Injectable({ providedIn: 'root' })
export class LimitsService {
  private auth = inject(AuthService);
  private posts = inject(PostsService);
  private accounts = inject(AccountsService);
  private owner = computed(() => this.auth.user()?.email ?? null);

  readonly limit = computed(() => PLAN_LIMITS[this.auth.user()?.plan ?? 'trial']);
  readonly videosUsed = signal(0);
  readonly videosLeft = computed(() => Math.max(this.limit().videos - this.videosUsed(), 0));
  readonly scheduledCount = computed(() => this.posts.posts().filter((p) => p.status === 'Scheduled').length);
  readonly scheduledLeft = computed(() => Math.max(this.limit().scheduled - this.scheduledCount(), 0));
  readonly accountsUsed = computed(() => this.accounts.accounts().filter((a) => a.status === 'Connected').length);
  readonly accountsLeft = computed(() => Math.max(this.limit().accounts - this.accountsUsed(), 0));

  readonly usage = computed(() => [
    { label: 'Videos this month', used: this.videosUsed(), max: this.limit().videos },
    { label: 'Scheduled posts', used: this.scheduledCount(), max: this.limit().scheduled },
    { label: 'Connected accounts', used: this.accountsUsed(), max: this.limit().accounts },
  ]);

  constructor() {
    effect(() => {
      this.owner();
      untracked(() => this.videosUsed.set(0));
    });
  }

  useVideos(count = 1) {
    this.videosUsed.update((used) => used + count);
  }
}