import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
})
export class Shell {
      links = [
    { label: 'Create post', path: '/app/create' },
    { label: 'Posts', path: '/app/posts' },
    { label: 'Accounts', path: '/app/accounts' },
    { label: 'Dashboard', path: '/app/dashboard' },
  ];
}