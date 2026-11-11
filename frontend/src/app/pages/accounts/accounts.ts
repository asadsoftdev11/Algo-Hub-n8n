import { Component, inject } from '@angular/core';
import { AccountsService, AccountStatus } from '../../services/accounts.service';
import { Platform } from '../../services/posts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.html',
})
export class Accounts {
  private accountsService = inject(AccountsService);
  accounts = this.accountsService.accounts;

  colors: Record<Platform, string> = {
    TikTok: 'bg-slate-900',
    LinkedIn: 'bg-sky-700',
    Facebook: 'bg-blue-600',
    Instagram: 'bg-pink-500',
  };

  statusStyle: Record<AccountStatus, string> = {
    Connected: 'bg-emerald-100 text-emerald-800',
    'Not connected': 'bg-slate-100 text-slate-600',
    Expired: 'bg-amber-100 text-amber-800',
  };

  connect(platform: Platform) {
    this.accountsService.connect(platform);
  }

  disconnect(platform: Platform) {
    const ok = confirm(`Disconnect ${platform}? Scheduled posts for this account will not be sent.`);
    if (ok) {
      this.accountsService.disconnect(platform);
    }
  }
}