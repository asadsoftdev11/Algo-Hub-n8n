import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PasswordField } from '../../shared/password-field';
import { AuthService } from '../../services/auth.service';
import { AuthPanel } from '../../shared/auth-panel';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink, AuthPanel, PasswordField],
  templateUrl: './signin.html',
})
export class Signin {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  email = '';
  password = '';
  errorMessage = signal('');

   busy = signal(false);

  async submit() {
    if (this.busy()) return;
    this.busy.set(true);
    this.errorMessage.set('');
    try {
      await this.auth.signIn(this.email.trim(), this.password);
      this.toast.success('Signed in successfully');
      await this.router.navigate([this.auth.isSubscribed() ? '/app/create' : '/app/demo']);
    } catch {
      this.errorMessage.set('Email or password is incorrect.');
    } finally {
      this.busy.set(false);
    }
  }
}