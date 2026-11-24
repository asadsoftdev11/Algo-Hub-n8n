import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  private toast = inject(ToastService);

  handleError(error: unknown) {
    console.error(error);
    this.toast.error('Something went wrong. Please try again.');
  }
}