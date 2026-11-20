import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollTop } from './shared/scroll-top';
import { Toasts } from './shared/toasts';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollTop, Toasts],
  templateUrl: './app.html',
})
export class App {
  private toast = inject(ToastService);

  @HostListener('window:offline')
  onOffline() {
    this.toast.error('You are offline. Changes may not be saved.');
  }

  @HostListener('window:online')
  onOnline() {
    this.toast.success('You are back online');
  }
}