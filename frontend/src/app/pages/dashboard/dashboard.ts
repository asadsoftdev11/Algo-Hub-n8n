import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { PostStatus, PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private postsService = inject(PostsService);
  private accountsService = inject(AccountsService);

  accounts = this.accountsService.accounts;
  recent = computed(() => this.postsService.posts().slice(0, 5));

     stats = computed(() => {
    const posts = this.postsService.posts();
    const countOf = (status: PostStatus) => posts.filter((p) => p.status === status).length;
    return [
      { label: 'Total posts', value: posts.length, note: 'All posts you have created', accent: 'border-t-slate-700' },
      { label: 'Published', value: countOf('Published'), note: 'Live on your accounts', accent: 'border-t-emerald-500' },
      { label: 'Scheduled', value: countOf('Scheduled'), note: 'Going out later', accent: 'border-t-sky-500' },
      { label: 'Needs attention', value: countOf('Failed'), note: 'Failed posts you can retry', accent: 'border-t-red-500' },
    ];
  });

  statusStyle: Record<PostStatus, string> = {
    Draft: 'bg-slate-100 text-slate-700',
    Scheduled: 'bg-sky-100 text-sky-800',
    Processing: 'bg-amber-100 text-amber-800',
    Published: 'bg-emerald-100 text-emerald-800',
    Failed: 'bg-red-100 text-red-700',
  };

  accountStyle = {
    Connected: 'bg-emerald-100 text-emerald-800',
    'Not connected': 'bg-slate-100 text-slate-600',
    Expired: 'bg-amber-100 text-amber-800',
  };
}