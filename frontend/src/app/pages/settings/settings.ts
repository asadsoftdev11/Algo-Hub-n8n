import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, RouterLink],
  templateUrl: './settings.html',
})
export class Settings {
  auth = inject(AuthService);

  name = this.auth.user()?.name ?? '';
  saved = signal(false);
  deletionRequested = signal(false);

  get planLabel() {
    const plan = this.auth.user()?.plan ?? 'trial';
    return plan === 'trial' ? 'Free trial' : `${plan[0].toUpperCase()}${plan.slice(1)} plan`;
  }

  async saveName() {
    await this.auth.updateName(this.name.trim());
    this.saved.set(true);
  }

  async requestDeletion() {
    const ok = confirm('Request deletion of your account and data? This cannot be undone.');
    if (!ok) return;
    await this.auth.requestDataDeletion();
    this.deletionRequested.set(true);
  }
}