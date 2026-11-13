import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollTop } from './shared/scroll-top';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollTop],
  templateUrl: './app.html',
})
export class App {}