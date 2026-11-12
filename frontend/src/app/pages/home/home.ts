import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  platforms = [
    { name: 'TikTok', url: 'https://www.tiktok.com', color: 'bg-slate-900' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', color: 'bg-sky-700' },
    { name: 'Facebook', url: 'https://www.facebook.com', color: 'bg-blue-600' },
    { name: 'Instagram', url: 'https://www.instagram.com', color: 'bg-pink-500' },
  ];

  progress = [
    { label: 'Script written with Gemini', icon: '✓', badge: 'bg-emerald-600 text-white' },
    { label: 'Video clips found with Pexels', icon: '✓', badge: 'bg-emerald-600 text-white' },
    { label: 'Publishing to your accounts', icon: '…', badge: 'bg-amber-100 text-amber-700' },
  ];

  steps = [
    { title: 'Type one idea', text: 'Write a topic or title in one simple box.' },
    { title: 'AI writes the script', text: 'Gemini turns your idea into ready content.' },
    { title: 'Video is created', text: 'Matching video clips are found and assembled.' },
    { title: 'Auto published', text: 'Your post goes live on every platform you pick.' },
  ];

  features = [
    { title: 'No manual work', text: 'No writing, downloading, or uploading. One prompt does it all.' },
    { title: 'Stay consistent', text: 'Keep posting every day without spending hours on it.' },
    { title: 'Made for everyone', text: 'Built for businesses, creators, agencies, and personal brands.' },
  ];

  plans = [
    { name: 'Starter', price: '$9', popular: false, features: ['5 posts per month', '1 platform', 'Basic support'] },
    { name: 'Pro', price: '$19', popular: true, features: ['60 posts per month', 'All platforms', 'Post scheduling', 'Priority support'] },
    { name: 'Agency', price: '$49', popular: false, features: ['Unlimited posts', 'All platforms', 'Team members', 'Dedicated support'] },
  ];
    marquee = Array.from({ length: 8 }, () => this.platforms).flat();
}