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
  avatar = this.auth.user()?.avatar ?? '';
  photoError = signal('');

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

    onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.photoError.set('');
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      this.photoError.set('Please choose an image smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 160;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const crop = Math.min(image.width, image.height);
        const sx = (image.width - crop) / 2;
        const sy = (image.height - crop) / 2;
        canvas.getContext('2d')?.drawImage(image, sx, sy, crop, crop, 0, 0, size, size);
        this.avatar = canvas.toDataURL('image/jpeg', 0.85);
        this.profileSaved.set(false);
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.avatar = '';
    this.profileSaved.set(false);
  }

  async saveProfile() {
    await this.auth.updateProfile({
      name: this.name.trim(),
      company: this.company.trim(),
      avatar: this.avatar,
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