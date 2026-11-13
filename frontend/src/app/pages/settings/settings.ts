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

  readonly timezones = Intl.supportedValuesOf('timeZone');

  name = this.auth.user()?.name ?? '';
  company = this.auth.user()?.company ?? '';
  timezone = this.auth.user()?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  newEmail = '';
  emailPassword = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  profileSaved = signal(false);
  emailChanged = signal(false);
  emailError = signal('');
  passwordChanged = signal(false);
  passwordError = signal('');
  deletionRequested = signal(false);

  get planLabel() {
    const plan = this.auth.user()?.plan ?? 'trial';
    return plan === 'trial' ? 'Free trial' : `${plan[0].toUpperCase()}${plan.slice(1)} plan`;
  }

  get canChangeEmail() {
    return this.newEmail.includes('@') && this.emailPassword !== '';
  }

  get passwordMismatch() {
    return this.confirmPassword !== '' && this.newPassword !== this.confirmPassword;
  }

  get canChangePassword() {
    return this.currentPassword !== '' && this.newPassword.length >= 8 && this.confirmPassword !== '' && !this.passwordMismatch;
  }

  async saveProfile() {
    await this.auth.updateProfile({
      name: this.name.trim(),
      company: this.company.trim(),
      timezone: this.timezone,
    });
    this.profileSaved.set(true);
  }

  async changeEmail() {
    this.emailError.set('');
    this.emailChanged.set(false);
    try {
      await this.auth.changeEmail(this.newEmail, this.emailPassword);
      this.newEmail = '';
      this.emailPassword = '';
      this.emailChanged.set(true);
    } catch {
      this.emailError.set('We could not change your email. Check your password, and make sure the new address is not already in use.');
    }
  }

  async changePassword() {
    this.passwordError.set('');
    this.passwordChanged.set(false);
    try {
      await this.auth.changePassword(this.currentPassword, this.newPassword);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordChanged.set(true);
    } catch {
      this.passwordError.set('Your current password is not correct. Please try again.');
    }
  }

  async requestDeletion() {
    const ok = confirm('Request deletion of your account and data? This cannot be undone.');
    if (!ok) return;
    await this.auth.requestDataDeletion();
    this.deletionRequested.set(true);
  }
}