import { Component, inject } from '@angular/core';
import { AccountsService, AccountStatus } from '../../services/accounts.service';
import { Platform } from '../../services/posts.service';
import { PlatformIcon } from '../../shared/platform-icon';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-accounts',
  imports: [PlatformIcon],
  templateUrl: './accounts.html',
})
export class Accounts {
  private accountsService = inject(AccountsService);
  private toast = inject(ToastService);
  accounts = this.accountsService.accounts;

  statusStyle: Record<AccountStatus, string> = {
    Connected: 'bg-emerald-100 text-emerald-800',
    'Not connected': 'bg-slate-100 text-slate-600',
    Expired: 'bg-amber-100 text-amber-800',
  };

    async connect(platform: Platform) {
    await this.accountsService.connect(platform);
    this.toast.success(`${platform} connected`);
  }

  async disconnect(platform: Platform) {
    const ok = confirm(`Disconnect ${platform}? Scheduled posts for this account will not be sent.`);
    if (ok) {
      await this.accountsService.disconnect(platform);
      this.toast.info(`${platform} disconnected`);
    }
  }
}