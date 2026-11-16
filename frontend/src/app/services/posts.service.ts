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

export interface PostRecord {
  id: number;
  title: string;
  platforms: Platform[];
  status: PostStatus;
  when: string;
  error?: string;
}

export interface PreviewResult {
  videoUrl: string | null;
  caption: string;
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

  private nextId = 100;

     readonly generationStages = [
    'Writing the script',
    'Finding video clips',
    'Building your video',
    'Waiting for the video to finish',
  ];

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

  async publish(request: PostRequest, onStage: (index: number) => void): Promise<void> {
    const stages = this.publishStagesFor(request.publishMode);
    for (let i = 0; i < stages.length; i++) {
      onStage(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const isNow = request.publishMode === 'now';
    const record: PostRecord = {
      id: this.nextId++,
      title: request.title,
      platforms: request.platforms,
      status: isNow ? 'Published' : 'Scheduled',
      when: isNow ? 'Just now' : `${request.scheduledAt?.replace('T', ' ')} (${request.timezone})`,
    };
    this.posts.update((list) => [record, ...list]);
  }

  saveDraft(request: PostRequest): void {
    const record: PostRecord = {
      id: this.nextId++,
      title: request.title,
      platforms: request.platforms,
      status: 'Draft',
      when: 'Not scheduled',
    };
    this.posts.update((list) => [record, ...list]);
  }
  
    async generateQuickPreview(request: PostRequest): Promise<PreviewResult> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      videoUrl: null,
      caption: request.caption || `A short post about ${request.title}.`,
    };
  }

  async scheduleMany(requests: PostRequest[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const records = requests.map(
      (request): PostRecord => ({
        id: this.nextId++,
        title: request.title,
        platforms: request.platforms,
        status: 'Scheduled',
        when: `${request.scheduledAt?.replace('T', ' ')} (${request.timezone})`,
      }),
    );
    this.posts.update((list) => [...records, ...list]);
  }

  async retry(id: number): Promise<void> {
    this.setStatus(id, 'Processing');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this.setStatus(id, 'Published');
  }

  private setStatus(id: number, status: PostStatus) {
    this.posts.update((list) =>
      list.map((p) => (p.id === id ? { ...p, status, error: undefined } : p)),
    );
  }
}