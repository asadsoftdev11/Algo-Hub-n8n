import { Injectable } from '@angular/core';

export interface VideoRequest {
  title: string;
  platforms: string[];
}

@Injectable({ providedIn: 'root' })
export class N8nService {
  stages = [
    'Writing script with Gemini',
    'Finding video clips on Pexels',
    'Building your video',
    'Waiting for the video to finish',
    'Publishing to your accounts',
  ];

  async run(request: VideoRequest, onStage: (index: number) => void): Promise<void> {
    for (let i = 0; i < this.stages.length; i++) {
      onStage(i);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}