import { Injectable, computed, signal } from '@angular/core';

export type PaidPlan = 'starter' | 'creator' | 'business';
export type Plan = 'trial' | PaidPlan;

export interface Profile {
  name: string;
  company: string;
  avatar: string;
  timezone: string;
}

export interface User extends Profile {
  email: string;
  plan: Plan;
  tenantId: string;
}

interface Account {
  passwordHash: string;
  tenantId: string;
  plan: Plan;
  profile: Profile;
}

const SESSION_KEY = 'autosocial_session';
const ACCOUNTS_KEY = 'autosocial_accounts';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.readSession());
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly isSubscribed = computed(() => (this.user()?.plan ?? 'trial') !== 'trial');

  async signUp(name: string, email: string, password: string, company = ''): Promise<void> {
    const key = this.normalize(email);
    if (this.readAccounts()[key]) {
      throw new Error('Account already exists');
    }
    const tenantId = crypto.randomUUID();
    const account: Account = {
      passwordHash: await this.hash(password, tenantId),
      tenantId,
      plan: 'trial',
      profile: { name, company, avatar: '', timezone: this.defaultTimezone() },
    };
    this.saveAccount(key, account);
    this.startSession(key, account);
  }

  async signIn(email: string, password: string): Promise<void> {
    const key = this.normalize(email);
    const account = this.readAccounts()[key];
    if (!account || !(await this.matches(account, password))) {
      throw new Error('Invalid email or password');
    }
    this.startSession(key, account);
  }

  async subscribe(plan: PaidPlan): Promise<void> {
    const { key, account } = this.requireAccount();
    account.plan = plan;
    this.saveAccount(key, account);
    this.startSession(key, account);
  }

  async updateProfile(profile: Profile): Promise<void> {
    const { key, account } = this.requireAccount();
    account.profile = profile;
    this.saveAccount(key, account);
    this.startSession(key, account);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const { key, account } = this.requireAccount();
    if (!(await this.matches(account, currentPassword))) {
      throw new Error('Current password is wrong');
    }
    account.passwordHash = await this.hash(newPassword, account.tenantId);
    this.saveAccount(key, account);
  }

  async changeEmail(newEmail: string, password: string): Promise<void> {
    const { key, account } = this.requireAccount();
    if (!(await this.matches(account, password))) {
      throw new Error('Password is wrong');
    }
    const newKey = this.normalize(newEmail);
    const accounts = this.readAccounts();
    if (newKey !== key && accounts[newKey]) {
      throw new Error('Email already in use');
    }
    delete accounts[key];
    accounts[newKey] = account;
    this.writeAccounts(accounts);
    this.startSession(newKey, account);
  }

  async requestPasswordReset(_email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  async requestDataDeletion(): Promise<void> {}

  signOut(): void {
    localStorage.removeItem(SESSION_KEY);
    this.user.set(null);
  }

  private startSession(email: string, account: Account) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    this.user.set(this.toUser(email, account));
  }

  private toUser(email: string, account: Account): User {
    return { ...account.profile, email, plan: account.plan, tenantId: account.tenantId };
  }

  private requireAccount() {
    const key = this.user()?.email;
    const account = key ? this.readAccounts()[key] : undefined;
    if (!key || !account) {
      throw new Error('Not signed in');
    }
    return { key, account };
  }

  private async matches(account: Account, password: string) {
    return account.passwordHash === (await this.hash(password, account.tenantId));
  }

  private async hash(password: string, salt: string) {
    const data = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private normalize(email: string) {
    return email.trim().toLowerCase();
  }

  private defaultTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  private readSession(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const { email } = JSON.parse(raw) as { email?: string };
      const account = email ? this.readAccounts()[email] : undefined;
      return email && account ? this.toUser(email, account) : null;
    } catch {
      return null;
    }
  }

  private readAccounts(): Record<string, Account> {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private writeAccounts(accounts: Record<string, Account>) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  private saveAccount(key: string, account: Account) {
    const accounts = this.readAccounts();
    accounts[key] = account;
    this.writeAccounts(accounts);
  }
}