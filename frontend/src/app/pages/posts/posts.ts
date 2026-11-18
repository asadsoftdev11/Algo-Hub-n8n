import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostRecord, PostStatus, PostsService } from '../../services/posts.service';
import { PlatformIcon } from '../../shared/platform-icon';

type Filter = 'All' | PostStatus;

@Component({
  selector: 'app-posts',
  imports: [RouterLink, PlatformIcon],
  templateUrl: './posts.html',
})
export class Posts {
  private postsService = inject(PostsService);
  private router = inject(Router);

  readonly filters: Filter[] = ['All', 'Draft', 'Scheduled', 'Processing', 'Published', 'Failed'];
  activeFilter = signal<Filter>('All');

  visiblePosts = computed(() => {
    const filter = this.activeFilter();
    const all = this.postsService.posts();
    return filter === 'All' ? all : all.filter((p) => p.status === filter);
  });

  statusStyle: Record<PostStatus, string> = {
    Draft: 'bg-slate-100 text-slate-700',
    Scheduled: 'bg-sky-100 text-sky-800',
    Processing: 'bg-amber-100 text-amber-800',
    Published: 'bg-emerald-100 text-emerald-800',
    Failed: 'bg-red-100 text-red-700',
  };

  count(filter: Filter) {
    const all = this.postsService.posts();
    return filter === 'All' ? all.length : all.filter((p) => p.status === filter).length;
  }

  edit(post: PostRecord) {
    if (this.postsService.startEdit(post.id)) {
      this.router.navigate(['/app/create']);
    }
  }

  duplicate(post: PostRecord) {
    if (this.postsService.startEdit(post.id, true)) {
      this.router.navigate(['/app/create']);
    }
  }

  remove(post: PostRecord) {
    if (confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      this.postsService.deletePost(post.id);
    }
  }

  cancelSchedule(post: PostRecord) {
    if (confirm('Cancel the schedule? The post will be kept as a draft.')) {
      this.postsService.cancelSchedule(post.id);
    }
  }

  retry(post: PostRecord) {
    this.postsService.retry(post.id);
  }
}