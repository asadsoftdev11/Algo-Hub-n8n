import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  stats = [
    { label: 'Videos created', value: 24, note: '6 more than last week' },
    { label: 'Published', value: 19, note: 'Live on your accounts' },
    { label: 'Scheduled', value: 3, note: 'Going out soon' },
    { label: 'Failed', value: 2, note: 'Need your attention' },
  ];

  usage = { used: 24, limit: 60 };

  get usagePercent() {
    return Math.round((this.usage.used / this.usage.limit) * 100);
  }

  activity = [
    { title: '5 daily habits for a productive morning', platforms: ['TikTok', 'Instagram'], status: 'Processing', date: 'Nov 4, 2026' },
    { title: 'How to start a small online business', platforms: ['LinkedIn', 'Facebook'], status: 'Scheduled', date: 'Nov 4, 2026' },
    { title: 'Three tips for better customer service', platforms: ['TikTok'], status: 'Published', date: 'Nov 3, 2026' },
    { title: 'Why consistency wins on social media', platforms: ['LinkedIn', 'Facebook', 'Instagram'], status: 'Published', date: 'Nov 2, 2026' },
    { title: 'Quick guide to budgeting for beginners', platforms: ['TikTok', 'Facebook'], status: 'Failed', date: 'Nov 1, 2026' },
  ];

  statusStyle: Record<string, string> = {
    Published: 'bg-emerald-100 text-emerald-800',
    Scheduled: 'bg-sky-100 text-sky-800',
    Processing: 'bg-amber-100 text-amber-800',
    Failed: 'bg-red-100 text-red-700',
  };
}