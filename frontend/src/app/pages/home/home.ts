import { Component, signal } from '@angular/core';
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
    { title: 'Published on schedule', text: 'Your post goes live on the platforms you pick, at the time you choose.' },
  ];

  features = [
    { title: 'Less manual work', text: 'No separate writing, downloading, and uploading. One idea starts the whole process.' },
    { title: 'Stay consistent', text: 'Keep posting every day without spending hours on it.' },
    { title: 'Made for everyone', text: 'Built for businesses, creators, agencies, and personal brands.' },
  ];

    plans = [
    { name: 'Starter', price: '$9', popular: false, features: ['1 connected account', 'Limited scheduled posts', 'Email support'] },
    { name: 'Creator', price: '$19', popular: true, features: ['Several connected accounts', 'Higher post allowance', 'Email support'] },
    { name: 'Business', price: '$49', popular: false, features: ['More connected accounts', 'Higher usage limits', 'Priority support'] },
  ];
    marquee = Array.from({ length: 8 }, () => this.platforms).flat();
    menuOpen = signal(false);
      calendar = Array.from({ length: 15 }, (_, i) => ({
    x: 36 + (i % 5) * 42,
    y: 82 + Math.floor(i / 5) * 34,
    active: [2, 6, 11].includes(i),
  }));
}