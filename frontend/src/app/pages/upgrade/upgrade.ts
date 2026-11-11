import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PaidPlan } from '../../services/auth.service';

interface PlanOption {
  id: PaidPlan;
  name: string;
  price: string;
  popular: boolean;
  features: string[];
}

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.html',
})
export class Upgrade {
  private router = inject(Router);
  auth = inject(AuthService);
  busy = signal(false);

  plans: PlanOption[] = [
    { id: 'starter', name: 'Starter', price: '$9', popular: false, features: ['1 connected account', 'Limited scheduled posts', 'Email support'] },
    { id: 'creator', name: 'Creator', price: '$19', popular: true, features: ['Several connected accounts', 'Higher post allowance', 'Email support'] },
    { id: 'business', name: 'Business', price: '$49', popular: false, features: ['More connected accounts', 'Higher usage limits', 'Priority support'] },
  ];

  async choose(plan: PlanOption) {
    this.busy.set(true);
    await this.auth.subscribe(plan.id);
    this.busy.set(false);
    this.router.navigate(['/app/create']);
  }
}