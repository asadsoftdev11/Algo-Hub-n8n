import { Injectable } from '@angular/core';

export type Platform = 'TikTok' | 'Instagram' | 'Facebook' | 'LinkedIn';
export type PublishMode = 'now' | 'schedule';

export interface PostRequest {
  title: string;
  caption: string;
  platforms: Platform[];
  publishMode: PublishMode;
  scheduledAt: string | null;
  timezone: string;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  stagesFor(mode: PublishMode): string[] {
    if (mode === 'schedule') {
      return ['Saving your post', 'Adding it to the schedule'];
    }
    return [
      'Writing the script',
      'Finding video clips',
      'Building your video',
      'Waiting for the video to finish',
      'Publishing to your accounts',
    ];
  }

  async submit(request: PostRequest, onStage: (index: number) => void): Promise<void> {
    const total = this.stagesFor(request.publishMode).length;
    for (let i = 0; i < total; i++) {
      onStage(i);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }
}