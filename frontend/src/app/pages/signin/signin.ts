import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  imports: [FormsModule, RouterLink],
  templateUrl: './signin.html',
})
export class Signin {
  private router = inject(Router);
  email = '';
  password = '';

  submit() {
      this.router.navigate(['/app/create']);
  }
}