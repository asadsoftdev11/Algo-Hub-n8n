import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-demo',
  imports: [RouterLink],
  templateUrl: './demo.html',
})
export class Demo {
  auth = inject(AuthService);

  // videoUrl = '';
  videoUrl = 'demo.mp4';

  unlocks = [
    { title: 'Create and schedule posts', text: 'Write your idea, review it, and publish now or pick a date, time, and timezone.' },
    { title: 'Connect your accounts', text: 'Link TikTok, LinkedIn, Facebook, and Instagram through each platform’s official login.' },
    { title: 'Track every post', text: 'See Draft, Scheduled, Processing, Published, or Failed, and retry anything that fails.' },
    { title: 'Monitor your usage', text: 'A dashboard shows your posts and how much of your plan you have used.' },
    { title: 'Bulk scheduling (Business plan)', text: 'Upload a spreadsheet of topics and dates, review each video, and schedule them together.' },
  ];

    tourSteps = [
    { badge: 'Step 1', title: 'Write your idea', text: 'Type a topic or title. Add your own caption if you like.' },
    { badge: 'Step 2', title: 'AI prepares the post', text: 'The script is written and the video clips are collected for you.' },
    { badge: 'Step 3', title: 'Review the video', text: 'Watch the result. Approve it, edit the idea, or discard it.' },
    { badge: 'Step 4', title: 'Publish or schedule', text: 'Send it now, or choose a date, time, and timezone.' },
  ];
  tourIndex = signal(0);

  constructor() {
    const timer = setInterval(() => this.tourIndex.update((i) => (i + 1) % this.tourSteps.length), 3500);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}