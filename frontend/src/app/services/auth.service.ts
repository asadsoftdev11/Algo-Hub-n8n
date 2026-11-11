import { Injectable, computed, signal } from '@angular/core';

export type PaidPlan = 'starter' | 'creator' | 'business';
export type Plan = 'trial' | PaidPlan;

export interface User {
  name: string;
  email: string;
  plan: Plan;
  tenantId: string;
}

const SESSION_KEY = 'autosocial_session';
const PLANS_KEY = 'autosocial_plans';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.readSession());
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly isSubscribed = computed(() => (this.user()?.plan ?? 'trial') !== 'trial');

  async signUp(name: string, email: string, _password: string): Promise<void> {
    this.startSession({ name, email, plan: this.savedPlan(email), tenantId: this.tenantFor(email) });
  }

  async signIn(email: string, _password: string): Promise<void> {
    const name = email.split('@')[0];
    this.startSession({ name, email, plan: this.savedPlan(email), tenantId: this.tenantFor(email) });
  }

  async subscribe(plan: PaidPlan): Promise<void> {
    const current = this.user();
    if (!current) return;
    const plans = this.readPlans();
    plans[current.email] = plan;
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    this.startSession({ ...current, plan });
  }

  signOut(): void {
    localStorage.removeItem(SESSION_KEY);
    this.user.set(null);
  }

  private startSession(user: User) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.user.set(user);
  }

  private tenantFor(email: string) {
    return `tenant-${email.toLowerCase()}`;
  }

  private savedPlan(email: string): Plan {
    return this.readPlans()[email] ?? 'trial';
  }

  private readSession(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private readPlans(): Record<string, Plan> {
    try {
      const raw = localStorage.getItem(PLANS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
}