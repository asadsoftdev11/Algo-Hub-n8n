import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PostRecord, PostStatus, PostsService } from '../../services/posts.service';
import { PlatformIcon } from '../../shared/platform-icon';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

type Filter = 'All' | PostStatus;

@Component({
  selector: 'app-posts',
  imports: [RouterLink, PlatformIcon],
  templateUrl: './posts.html',
})
export class Posts {
  private postsService = inject(PostsService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private dialog = inject(ConfirmService);

  readonly filters: Filter[] = ['All', 'Draft', 'Scheduled', 'Processing', 'Published', 'Failed'];
  activeFilter = signal<Filter>('All');
  query = signal('');

  shownPosts = computed(() => {
    const text = this.query().trim().toLowerCase();
    const list = this.visiblePosts();
    return text ? list.filter((p) => p.title.toLowerCase().includes(text)) : list;
  });

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

   async remove(post: PostRecord) {
    const note = post.status === 'Published' ? ' Posts already published stay on the platform.' : '';
        const ok = await this.dialog.ask({
      title: 'Delete post?',
      message: `"${post.title}" will be removed from AutoSocial AI. This cannot be undone.${note}`,
      confirmText: 'Delete',
      danger: true,
    });
    if (ok) {
      this.postsService.deletePost(post.id);
      this.toast.success('Post deleted');
    }
  }

  async cancelSchedule(post: PostRecord) {
        const ok = await this.dialog.ask({
      title: 'Cancel schedule?',
      message: 'The post will be kept as a draft and will not be published.',
      confirmText: 'Cancel schedule',
      cancelText: 'Keep schedule',
    });
    if (ok) {
      this.postsService.cancelSchedule(post.id);
      this.toast.info('Schedule cancelled. The post was kept as a draft.');
    }
  }

  async retry(post: PostRecord) {
    await this.postsService.retry(post.id);
    this.toast.success('Post published');
  }
}