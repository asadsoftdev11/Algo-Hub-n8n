import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
})
export class Signup {
  private router = inject(Router);
  private auth = inject(AuthService);

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

  async submit() {
    this.errorMessage.set('');
    try {
      await this.auth.signUp(this.fullName.trim(), this.email.trim(), this.password);
      this.router.navigate(['/app/demo']);
    } catch {
      this.errorMessage.set('We could not create your account. Please try again.');
    }
  }
}