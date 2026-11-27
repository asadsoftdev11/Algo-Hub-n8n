import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, PaidPlan } from '../../services/auth.service';
import { Reveal } from '../../shared/reveal.directive';
import { ToastService } from '../../services/toast.service';
import { BillingService } from '../../services/billing.service';
import { PLAN_LIMITS } from '../../shared/plan-limits';

interface PlanOption {
  id: PaidPlan;
  name: string;
  price: string;
  popular: boolean;
  icon: string;
  tint: string;
  surface: string;
  features: string[];
}

@Component({
  selector: 'app-upgrade',
    imports: [Reveal],
  templateUrl: './upgrade.html',
})
export class Upgrade {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  billing = inject(BillingService);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  busy = signal(false);
  selected = signal<PlanOption | null>(null);

  plans: PlanOption[] = [
    { id: 'starter', name: 'Starter', price: '$9', popular: false, icon: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z', tint: 'bg-sky-100 text-sky-700', surface: 'from-amber-100 via-amber-50 to-white', features: [`${PLAN_LIMITS.starter.accounts} connected account`, `${PLAN_LIMITS.starter.videos} videos per month, ${PLAN_LIMITS.starter.scheduled} scheduled at a time`, 'Email support'] },
    { id: 'creator', name: 'Creator', price: '$19', popular: true, icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', tint: 'bg-emerald-100 text-emerald-700', surface: 'from-emerald-100 via-emerald-50 to-lime-50', features: [`${PLAN_LIMITS.creator.accounts} connected accounts`, `${PLAN_LIMITS.creator.videos} videos per month, ${PLAN_LIMITS.creator.scheduled} scheduled at a time`, 'Email support'] },
    { id: 'business', name: 'Business', price: '$49', popular: false, icon: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16', tint: 'bg-violet-100 text-violet-700', surface: 'from-sky-100 via-sky-50 to-blue-100', features: [`${PLAN_LIMITS.business.accounts} connected accounts`, 'Bulk scheduling from spreadsheets', `${PLAN_LIMITS.business.videos} videos per month, ${PLAN_LIMITS.business.scheduled} scheduled at a time`, 'Priority support'] },
  ];

   constructor() {
    const status = this.route.snapshot.queryParamMap.get('status');
    if (status === 'success') this.toast.success('Payment received. Your plan will be active in a moment.');
    if (status === 'cancelled') this.toast.info('Payment cancelled. You were not charged.');
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeCheckout();
  }

  choose(plan: PlanOption) {
    this.selected.set(plan);
  }

  closeCheckout() {
    if (!this.busy()) this.selected.set(null);
  }

  async confirm() {
    const plan = this.selected();
    if (!plan || this.busy()) return;

    this.busy.set(true);
    try {
      const result = await this.billing.startCheckout(plan.id);
      if (result.mode === 'redirect' && result.url) {
        window.location.assign(result.url);
        return;
      }
      await this.auth.subscribe(plan.id);
      this.toast.success(`You are now on the ${plan.name} plan`);
      this.selected.set(null);
      await this.router.navigate(['/app/create']);
    } catch {
      this.toast.error('We could not start the payment. Please try again.');
    } finally {
      this.busy.set(false);
    }
  }
}