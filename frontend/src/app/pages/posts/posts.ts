import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostStatus, PostsService } from '../../services/posts.service';

type Filter = 'All' | PostStatus;

@Component({
  selector: 'app-posts',
  imports: [RouterLink],
  templateUrl: './posts.html',
})
export class Posts {
  private postsService = inject(PostsService);

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

  retry(id: number) {
    this.postsService.retry(id);
  }
}