import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Section {
  heading: string;
  text: string;
}

interface LegalDoc {
  title: string;
  sections: Section[];
}

const DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Information we collect',
        text: "We collect your name, email address, and optional business name when you sign up. We also store the posts you create, including captions, media, and schedules, along with the status of each post.",
      },
      {
        heading: 'How we use your information',
        text: "We use your information to run the service: to publish posts at the times you choose, to show you their status, to manage your subscription, and to keep the platform secure.",
      },
      {
        heading: 'Connecting your social accounts',
        text: "You connect accounts through each platform's own login page. We never see or store your social media passwords. We keep the access needed to publish on your behalf in a secure, server-side store, and we only use it to publish the posts you create. You can disconnect any account at any time.",
      },
      {
        heading: 'Services we rely on',
        text: "To deliver the service we use trusted providers for automation, AI content generation, media handling, payments, and the social platforms you choose to publish to. They receive only the information needed to do their part.",
      },
      {
        heading: 'Keeping customer data separate',
        text: "Each customer's data is kept separate from every other customer's data. You can only see and manage your own accounts, posts, and settings.",
      },
      {
        heading: 'Retention and deletion',
        text: "You can request deletion of your account and data from the Settings page. Disconnecting an account stops us from publishing to it.",
      },
      {
        heading: 'Security',
        text: "We use encrypted connections, restricted access, and secure storage for sensitive information. We do not write access tokens or passwords to our logs.",
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      {
        heading: 'Using the service',
        text: "AutoSocial AI helps you create, schedule, and publish social media posts. You must provide accurate information when you register and keep your login details private.",
      },
      {
        heading: 'Free trial',
        text: "The free trial lets you view the demo and the available plans. Creating, scheduling, and publishing posts requires an active subscription.",
      },
      {
        heading: 'Your content',
        text: "You own the content you create. You are responsible for it, and you confirm that you have the right to use any text, images, and video you publish through the service.",
      },
      {
        heading: 'Platform rules',
        text: "Publishing depends on third-party platforms such as TikTok, LinkedIn, Facebook, and Instagram. You must follow their rules. They may limit, delay, or reject posts, and we cannot guarantee that every post will publish.",
      },
      {
        heading: 'No guarantee of results',
        text: "We do not promise any level of reach, engagement, or revenue from the posts you publish.",
      },
      {
        heading: 'Plans and billing',
        text: "Paid plans are billed monthly. Prices and plan limits are shown before you subscribe and may change with notice.",
      },
      {
        heading: 'Ending your use',
        text: "You can stop using the service at any time. We may suspend accounts that break these terms or the rules of the connected platforms.",
      },
      {
        heading: 'Changes to these terms',
        text: "We may update these terms from time to time. Continued use of the service means you accept the updated terms.",
      },
    ],
  },
};

@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  templateUrl: './legal.html',
})
export class Legal {
  private route = inject(ActivatedRoute);

  readonly contactEmail = 'support@yourcompany.com';
  readonly doc = DOCS[this.route.snapshot.data['doc']] ?? DOCS['privacy'];
}