import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(path: string) {
    return this.send(this.http.get<T>(this.url(path)));
  }

  post<T>(path: string, body: unknown) {
    return this.send(this.http.post<T>(this.url(path), body));
  }

  put<T>(path: string, body: unknown) {
    return this.send(this.http.put<T>(this.url(path), body));
  }

  delete<T>(path: string) {
    return this.send(this.http.delete<T>(this.url(path)));
  }

  private url(path: string) {
    return `${environment.apiUrl}${path}`;
  }

  private async send<T>(request: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(request);
    } catch (error) {
      const status = error instanceof HttpErrorResponse ? error.status : 0;
      throw new ApiError(status, this.messageFor(status, error));
    }
  }

  private messageFor(status: number, error: unknown) {
    if (status === 0) return 'We could not reach the server. Please check your connection.';
    if (status === 429) return 'Too many requests. Please wait a moment and try again.';
    if (status >= 500) return 'Something went wrong on our side. Please try again.';
    const detail = error instanceof HttpErrorResponse ? error.error?.message : null;
    return typeof detail === 'string' ? detail : 'The request could not be completed.';
  }
}