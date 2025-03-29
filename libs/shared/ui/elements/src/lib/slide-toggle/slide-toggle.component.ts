import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'lib-slide-toggle',
  imports: [CommonModule],
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
})
export class SlideToggleComponent {
  isActive = signal(false);

  toggleSlide() {
    this.isActive.update((active) => !active);
  }
}
