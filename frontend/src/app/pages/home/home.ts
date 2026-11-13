import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../shared/reveal.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Reveal],
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
    { name: 'Starter', price: '$9', popular: false, icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z', tint: 'bg-sky-100 text-sky-700', features: ['1 connected account', 'Limited scheduled posts', 'Email support'] },
    { name: 'Creator', price: '$19', popular: true, icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', tint: 'bg-emerald-100 text-emerald-700', features: ['Several connected accounts', 'Higher post allowance', 'Email support'] },
    { name: 'Business', price: '$49', popular: false, icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16', tint: 'bg-violet-100 text-violet-700', features: ['More connected accounts', 'Higher usage limits', 'Priority support'] },
  ];
    marquee = Array.from({ length: 8 }, () => this.platforms).flat();
    menuOpen = signal(false);
      calendar = Array.from({ length: 15 }, (_, i) => ({
    x: 36 + (i % 5) * 42,
    y: 82 + Math.floor(i / 5) * 34,
    active: [2, 6, 11].includes(i),
  }));
}