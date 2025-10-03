import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'hl-health-target-item',
  templateUrl: './health-target-item.component.html',
  styleUrl: './health-target-item.component.scss',
  host: {
    role: 'button',
  },
  imports: [TitleCasePipe, NgClass],
})
export class HealthTargetItemComponent {
  active = input<boolean>();
}
