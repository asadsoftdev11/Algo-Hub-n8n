import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AuthPanel } from '../../shared/auth-panel';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink, AuthPanel],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  private token = this.route.snapshot.queryParamMap.get('token') ?? '';

  password = '';
  confirm = '';
  saving = signal(false);
  errorMessage = signal('');

  get mismatch() {
    return this.confirm !== '' && this.password !== this.confirm;
  }

  get canSubmit() {
    return this.password.length >= 8 && this.confirm !== '' && !this.mismatch && !this.saving();
  }

  async submit() {
    if (!this.canSubmit) return;
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      await this.auth.resetPassword(this.token, this.password);
      this.toast.success('Password updated. Please sign in.');
      await this.router.navigate(['/signin']);
    } catch {
      this.errorMessage.set('This link is no longer valid. Please request a new one.');
    } finally {
      this.saving.set(false);
    }
  }
}