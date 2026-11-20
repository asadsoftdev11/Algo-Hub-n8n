import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthPanel } from '../../shared/auth-panel';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink, AuthPanel],
  templateUrl: './signin.html',
})
export class Signin {
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  email = '';
  password = '';
  errorMessage = signal('');

  async submit() {
    this.errorMessage.set('');
    try {
      await this.auth.signIn(this.email.trim(), this.password);
      this.toast.success('Signed in successfully');
      this.router.navigate([this.auth.isSubscribed() ? '/app/create' : '/app/demo']);
    } catch {
      this.errorMessage.set('Email or password is incorrect.');
    }
  }
}