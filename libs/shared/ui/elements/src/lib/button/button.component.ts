import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { BadgeConfig, IconType } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';
@Component({
  selector: 'lib-button',
  imports: [CommonModule, IconComponent],
  template: `
    @if (icon()) {
      <lib-icon
        [ngClass]="{ 'bg-secondary text-white': appearance() === 'fill' }"
        [icon]="icon()"
        [inheritCurrentColor]="inheritIconFillColor()"
      ></lib-icon>
    }

    <ng-content></ng-content>
  `,
  host: {
    class: `text-caption inline-flex justify-center items-center gap-1 px-2
     py-1 rounded-md hover:cursor-pointer w-fit transition font-medium`,
    '[attr.type]': 'type()',
    '[class]': 'appearance() === "fill" ? "bg-secondary text-primary" : ""',
    '[class.disabled]': 'disabled()',
  },
})
export class ButtonComponent {
  badge = input<BadgeConfig>();
  icon = input<IconType>();
  disabled = input<boolean>();
  appearance = input<'transparent' | 'fill'>('transparent');
  type = input<'button' | 'submit'>('button');
  inheritIconFillColor = input(false);
}
