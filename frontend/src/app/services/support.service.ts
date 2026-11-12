import { Injectable } from '@angular/core';

export interface SupportMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class SupportService {
  async sendMessage(_message: SupportMessage): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
}