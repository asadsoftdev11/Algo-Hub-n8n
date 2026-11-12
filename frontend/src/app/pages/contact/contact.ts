import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SupportService } from '../../services/support.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink],
  templateUrl: './contact.html',
})
export class Contact {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private support = inject(SupportService);

  readonly embedded = this.route.snapshot.data['embedded'] === true;
  readonly contactEmail = 'support@yourcompany.com';
  readonly topics = ['General question', 'Billing and plans', 'Technical problem', 'Account and data'];

  name = this.auth.user()?.name ?? '';
  email = this.auth.user()?.email ?? '';
  topic = this.topics[0];
  message = '';

  sending = signal(false);
  sent = signal(false);
  errorMessage = signal('');

  faqs = [
    {
      question: 'Which platforms can I publish to?',
      answer: 'TikTok, LinkedIn, Facebook, and Instagram. You connect each one from the Accounts page.',
    },
    {
      question: 'Do you store my social media password?',
      answer: 'No. You sign in on each platform’s own page, so we never see your password.',
    },
    {
      question: 'What does the free trial include?',
      answer: 'The trial lets you watch the demo and see the plans. Creating, scheduling, and publishing posts needs a subscription.',
    },
    {
      question: 'Why did my post fail?',
      answer: 'The most common reason is an expired connection. Reconnect the account on the Accounts page, then press Retry on the Posts page.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes. Open Plans in the menu and choose a different plan.',
    },
  ];

  async submit() {
    this.errorMessage.set('');
    this.sending.set(true);
    try {
      await this.support.sendMessage({
        name: this.name.trim(),
        email: this.email.trim(),
        topic: this.topic,
        message: this.message.trim(),
      });
      this.sent.set(true);
    } catch {
      this.errorMessage.set('We could not send your message. Please try again, or email us directly.');
    } finally {
      this.sending.set(false);
    }
  }

  sendAnother() {
    this.message = '';
    this.sent.set(false);
  }
}