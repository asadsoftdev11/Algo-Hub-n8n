import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-demo',
  imports: [RouterLink],
  templateUrl: './demo.html',
})
export class Demo {
  auth = inject(AuthService);

  unlocks = [
    { title: 'Create and schedule posts', text: 'Write your idea, review it, and publish now or pick a date, time, and timezone.' },
    { title: 'Connect your accounts', text: 'Link TikTok, LinkedIn, Facebook, and Instagram through each platform’s official login.' },
    { title: 'Track every post', text: 'See Draft, Scheduled, Processing, Published, or Failed, and retry anything that fails.' },
    { title: 'Monitor your usage', text: 'A dashboard shows your posts and how much of your plan you have used.' },
  ];
}