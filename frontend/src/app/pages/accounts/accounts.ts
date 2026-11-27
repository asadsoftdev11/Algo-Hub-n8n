import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService, AccountStatus } from '../../services/accounts.service';
import { Platform } from '../../services/posts.service';
import { PlatformIcon } from '../../shared/platform-icon';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { LimitsService } from '../../services/limits.service';

@Component({
  selector: 'app-accounts',
  imports: [PlatformIcon],
  templateUrl: './accounts.html',
})
export class Accounts {
  private accountsService = inject(AccountsService);
  private toast = inject(ToastService);
  private dialog = inject(ConfirmService);
  private limits = inject(LimitsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly returnPages: Record<string, string> = {
    '/app/create': 'Create post',
    '/app/bulk': 'Bulk schedule',
  };
  private readonly requested = this.route.snapshot.queryParamMap.get('returnTo') ?? '';
  readonly returnTo = Object.hasOwn(this.returnPages, this.requested) ? this.requested : null;
  readonly returnLabel = this.returnTo ? this.returnPages[this.returnTo] : '';
  accounts = this.accountsService.accounts;

  statusStyle: Record<AccountStatus, string> = {
    Connected: 'bg-emerald-100 text-emerald-800',
    'Not connected': 'bg-slate-100 text-slate-600',
    Expired: 'bg-amber-100 text-amber-800',
  };

  goBack() {
    if (this.returnTo) void this.router.navigateByUrl(this.returnTo);
  }

  async connect(platform: Platform) {
    if (this.limits.accountsLeft() < 1) {
      this.toast.error(`Your plan allows ${this.limits.limit().accounts} connected accounts. Upgrade to connect more.`);
      return;
    }
    await this.accountsService.connect(platform);
    this.toast.success(`${platform} connected`);
  }

  async disconnect(platform: Platform) {
      const ok = await this.dialog.ask({
      title: `Disconnect ${platform}?`,
      message: 'Scheduled posts for this account will not be sent.',
      confirmText: 'Disconnect',
      danger: true,
    });
    if (ok) {
      await this.accountsService.disconnect(platform);
      this.toast.info(`${platform} disconnected`);
    }
  }
}