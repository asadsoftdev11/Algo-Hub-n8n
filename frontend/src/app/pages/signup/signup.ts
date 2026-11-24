import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthPanel } from '../../shared/auth-panel';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink, AuthPanel],
  templateUrl: './signup.html',
})
export class Signup {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  fullName = '';
  company = '';
  email = '';
  password = '';
  confirm = '';
  agree = false;
  errorMessage = signal('');

  get mismatch() {
    return this.confirm !== '' && this.password !== this.confirm;
  }

  busy = signal(false);

  async submit() {
    if (this.busy()) return;
    this.busy.set(true);
    this.errorMessage.set('');
    try {
      await this.auth.signUp(this.fullName.trim(), this.email.trim(), this.password, this.company.trim());
      this.toast.success('Account created. Welcome to AutoSocial AI!');
      await this.router.navigate(['/verify-email']);
    } catch {
      this.errorMessage.set('We could not create your account. If you already have one, try signing in instead.');
    } finally {
      this.busy.set(false);
    }
  }
}