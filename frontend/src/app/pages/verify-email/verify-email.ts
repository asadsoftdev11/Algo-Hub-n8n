import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AuthPanel } from '../../shared/auth-panel';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, AuthPanel],
  templateUrl: './verify-email.html',
})
export class VerifyEmail {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  readonly email = this.auth.user()?.email ?? 'your email address';
  wait = signal(0);
  sending = signal(false);
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  async resend() {
    if (this.wait() > 0 || this.sending()) return;
    this.sending.set(true);
    try {
      await this.auth.resendVerification(this.email);
      this.toast.success('Verification email sent');
      this.startCooldown();
    } catch {
      this.toast.error('We could not send the email. Please try again.');
    } finally {
      this.sending.set(false);
    }
  }

  private startCooldown() {
    this.wait.set(30);
    this.timer = setInterval(() => {
      this.wait.update((n) => n - 1);
      if (this.wait() <= 0) clearInterval(this.timer);
    }, 1000);
  }
}