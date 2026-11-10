import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { N8nService } from '../../services/n8n.service';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.html',
})
export class Create {
  private n8n = inject(N8nService);

  title = '';
  platforms = [
    { name: 'TikTok', selected: true },
    { name: 'Instagram', selected: false },
    { name: 'Facebook', selected: false },
    { name: 'LinkedIn', selected: false },
  ];
  stages = this.n8n.stages;

  running = signal(false);
  done = signal(false);
  currentStage = signal(-1);
  publishedTo = signal('');

  get canRun() {
    const hasPlatform = this.platforms.some((p) => p.selected);
    return this.title.trim().length >= 5 && hasPlatform && !this.running();
  }

  async execute() {
    const chosen = this.platforms.filter((p) => p.selected).map((p) => p.name);
    this.running.set(true);
    this.done.set(false);
    this.currentStage.set(0);

    await this.n8n.run({ title: this.title.trim(), platforms: chosen }, (i) => this.currentStage.set(i));

    this.currentStage.set(this.stages.length);
    this.publishedTo.set(chosen.join(', '));
    this.running.set(false);
    this.done.set(true);
  }

  reset() {
    this.title = '';
    this.done.set(false);
    this.currentStage.set(-1);
  }

  badge(i: number) {
    if (i < this.currentStage()) return 'bg-emerald-600 text-white';
    if (i === this.currentStage()) return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-400';
  }
}