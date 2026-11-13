import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private auth = inject(AuthService);

  email = '';
  sending = signal(false);
  sent = signal(false);

  async submit() {
    this.sending.set(true);
    try {
      await this.auth.requestPasswordReset(this.email.trim());
    } finally {
      this.sending.set(false);
      this.sent.set(true);
    }
  }
}