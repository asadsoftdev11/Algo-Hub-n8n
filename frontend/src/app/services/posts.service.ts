import { Injectable, signal } from '@angular/core';

export type Platform = 'TikTok' | 'Instagram' | 'Facebook' | 'LinkedIn';
export type PublishMode = 'now' | 'schedule';
export type PostStatus = 'Draft' | 'Scheduled' | 'Processing' | 'Published' | 'Failed';

export interface PostRequest {
  title: string;
  caption: string;
  platforms: Platform[];
  publishMode: PublishMode;
  scheduledAt: string | null;
  timezone: string;
}

export interface PreviewResult {
  videoUrl: string | null;
  caption: string;
}

export interface PostRecord {
  id: number;
  title: string;
  platforms: Platform[];
  status: PostStatus;
  when: string;
  error?: string;
  request?: PostRequest;
  videoUrl?: string | null;
}

export interface PendingEdit {
  request: PostRequest;
  videoUrl: string | null;
  startAt: 'form' | 'preview';
  replaceId: number | null;
}

export interface SaveOptions {
  replaceId?: number | null;
  videoUrl?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  readonly posts = signal<PostRecord[]>([
    { id: 1, title: 'Behind the scenes at our office', platforms: ['LinkedIn'], status: 'Draft', when: 'Not scheduled' },
    { id: 2, title: 'Weekend offer announcement', platforms: ['Facebook', 'Instagram'], status: 'Scheduled', when: '2026-11-12 10:00 (Asia/Karachi)' },
    { id: 3, title: 'Three tips for better customer service', platforms: ['TikTok'], status: 'Processing', when: 'Publishing now' },
    { id: 4, title: '5 daily habits for a productive morning', platforms: ['TikTok', 'Instagram'], status: 'Published', when: 'Nov 8, 2026' },
    {
      id: 5,
      title: 'How to start a small online business',
      platforms: ['LinkedIn', 'Facebook'],
      status: 'Failed',
      when: 'Nov 7, 2026',
      error: 'LinkedIn login expired. Reconnect your account, then retry.',
    },
  ]);

  readonly generationStages = [
    'Writing the script',
    'Finding video clips',
    'Building your video',
    'Waiting for the video to finish',
  ];

  private nextId = 100;
  private pendingEdit: PendingEdit | null = null;

  publishStagesFor(mode: PublishMode): string[] {
    return mode === 'schedule'
      ? ['Saving your post', 'Adding it to the schedule']
      : ['Sending to your accounts', 'Confirming with each platform'];
  }

  async generatePreview(request: PostRequest, onStage: (index: number) => void): Promise<PreviewResult> {
    for (let i = 0; i < this.generationStages.length; i++) {
      onStage(i);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    return {
      videoUrl: null,
      caption: request.caption || `A short post about ${request.title}.`,
    };
  }

  async generateQuickPreview(request: PostRequest): Promise<PreviewResult> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      videoUrl: null,
      caption: request.caption || `A short post about ${request.title}.`,
    };
  }

  async publish(request: PostRequest, onStage: (index: number) => void, options: SaveOptions = {}): Promise<void> {
    const stages = this.publishStagesFor(request.publishMode);
    for (let i = 0; i < stages.length; i++) {
      onStage(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const isNow = request.publishMode === 'now';
    this.store(request, isNow ? 'Published' : 'Scheduled', isNow ? 'Just now' : this.scheduleLabel(request), options);
  }

  async scheduleMany(requests: PostRequest[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    [...requests].reverse().forEach((request) => this.store(request, 'Scheduled', this.scheduleLabel(request)));
  }

  saveDraft(request: PostRequest, options: SaveOptions = {}): void {
    this.store(request, 'Draft', 'Not scheduled', options);
  }

  startEdit(id: number, asCopy = false): boolean {
    const post = this.posts().find((p) => p.id === id);
    if (!post) return false;

    const saved = post.request ?? this.fallbackRequest(post);
    this.pendingEdit = {
      request: asCopy ? { ...saved, publishMode: 'now', scheduledAt: null } : saved,
      videoUrl: asCopy ? null : (post.videoUrl ?? null),
      startAt: !asCopy && post.request ? 'preview' : 'form',
      replaceId: asCopy ? null : id,
    };
    return true;
  }

  takePendingEdit(): PendingEdit | null {
    const edit = this.pendingEdit;
    this.pendingEdit = null;
    return edit;
  }

  deletePost(id: number): void {
    this.posts.update((list) => list.filter((p) => p.id !== id));
  }

  cancelSchedule(id: number): void {
    this.posts.update((list) =>
      list.map((p) => (p.id === id ? { ...p, status: 'Draft', when: 'Not scheduled' } : p)),
    );
  }

  async retry(id: number): Promise<void> {
    this.setStatus(id, 'Processing');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this.setStatus(id, 'Published');
  }

  private store(request: PostRequest, status: PostStatus, when: string, options: SaveOptions = {}) {
    const record: PostRecord = {
      id: this.nextId++,
      title: request.title,
      platforms: request.platforms,
      status,
      when,
      request,
      videoUrl: options.videoUrl ?? null,
    };
    this.posts.update((list) => [record, ...list.filter((p) => p.id !== options.replaceId)]);
  }

  private scheduleLabel(request: PostRequest) {
    return `${request.scheduledAt?.replace('T', ' ')} (${request.timezone})`;
  }

  private fallbackRequest(post: PostRecord): PostRequest {
    return {
      title: post.title,
      caption: '',
      platforms: post.platforms,
      publishMode: 'now',
      scheduledAt: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  private setStatus(id: number, status: PostStatus) {
    this.posts.update((list) =>
      list.map((p) => (p.id === id ? { ...p, status, error: undefined } : p)),
    );
  }
}