import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.html',
})
export class Signin {
  private router = inject(Router);
  private auth = inject(AuthService);

  email = '';
  password = '';
  errorMessage = signal('');

  async submit() {
    this.errorMessage.set('');
    try {
      await this.auth.signIn(this.email.trim(), this.password);
      this.router.navigate([this.auth.isSubscribed() ? '/app/create' : '/app/demo']);
    } catch {
      this.errorMessage.set('Email or password is incorrect.');
    }
  }
}