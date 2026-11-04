import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
})
export class Signup {
  private router = inject(Router);
  fullName = '';
  company = '';
  email = '';
  password = '';
  confirm = '';
  agree = false;

  get mismatch() {
    return this.confirm !== '' && this.password !== this.confirm;
  }

  submit() {
    this.router.navigate(['/app/dashboard']);
  }
}