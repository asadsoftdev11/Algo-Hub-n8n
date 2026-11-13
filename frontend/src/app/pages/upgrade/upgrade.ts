import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PaidPlan } from '../../services/auth.service';

interface PlanOption {
  id: PaidPlan;
  name: string;
  price: string;
  popular: boolean;
  icon: string;
  tint: string;
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
    { id: 'starter', name: 'Starter', price: '$9', popular: false, icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z', tint: 'bg-sky-100 text-sky-700', features: ['1 connected account', 'Limited scheduled posts', 'Email support'] },
    { id: 'creator', name: 'Creator', price: '$19', popular: true, icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', tint: 'bg-emerald-100 text-emerald-700', features: ['Several connected accounts', 'Higher post allowance', 'Email support'] },
    { id: 'business', name: 'Business', price: '$49', popular: false, icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16', tint: 'bg-violet-100 text-violet-700', features: ['More connected accounts', 'Higher usage limits', 'Priority support'] },
  ];

  async choose(plan: PlanOption) {
    this.busy.set(true);
    await this.auth.subscribe(plan.id);
    this.busy.set(false);
    this.router.navigate(['/app/create']);
  }
}