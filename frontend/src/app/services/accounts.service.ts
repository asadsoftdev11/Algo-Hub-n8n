import { Injectable, signal } from '@angular/core';
import { Platform } from './posts.service';

export type AccountStatus = 'Connected' | 'Not connected' | 'Expired';

export interface SocialAccount {
  platform: Platform;
  status: AccountStatus;
}

@Injectable({ providedIn: 'root' })
export class AccountsService {
  readonly accounts = signal<SocialAccount[]>([
    { platform: 'TikTok', status: 'Not connected' },
    { platform: 'Instagram', status: 'Not connected' },
    { platform: 'Facebook', status: 'Not connected' },
    { platform: 'LinkedIn', status: 'Not connected' },
  ]);

  isConnected(platform: Platform): boolean {
    return this.accounts().some((a) => a.platform === platform && a.status === 'Connected');
  }

  async connect(platform: Platform): Promise<void> {
    this.setStatus(platform, 'Connected');
  }

  async disconnect(platform: Platform): Promise<void> {
    this.setStatus(platform, 'Not connected');
  }

  private setStatus(platform: Platform, status: AccountStatus) {
    this.accounts.update((list) => list.map((a) => (a.platform === platform ? { ...a, status } : a)));
  }
}