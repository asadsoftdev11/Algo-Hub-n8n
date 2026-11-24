import { Injectable } from '@angular/core';
import { PaidPlan } from './auth.service';
import { environment } from '../../environments/environment';

export interface CheckoutResult {
  mode: 'demo' | 'redirect';
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class BillingService {
  readonly isDemo = environment.demo;

  async startCheckout(_plan: PaidPlan): Promise<CheckoutResult> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { mode: 'demo' };
  }
}