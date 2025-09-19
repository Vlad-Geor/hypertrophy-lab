import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { BadgeConfig, IconType, Size } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

const buttonSizeMap: Record<Extract<Size, 'sm' | 'md' | 'lg' | 'xl'>, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

@Component({
  selector: 'lib-button',
  imports: [CommonModule, IconComponent, NgClass],
  template: `
    @if (icon()) {
      <lib-icon
        [ngClass]="{ 'bg-secondary text-white': appearance() === 'fill' }"
        [icon]="icon()"
        [fillContainer]="inheritIconFillColor()"
      ></lib-icon>
    }
    <ng-content select="lib-icon[left]"></ng-content>

    <ng-content></ng-content>

    <ng-content select="lib-icon[right]"></ng-content>
  `,
  host: {
    '[attr.type]': 'type()',
    '[class]': 'componentClasses()',
    '[class.disabled]': 'disabled()',
  },
  styles: `
    :host {
      @apply inline-flex justify-center items-center gap-1 rounded hover:cursor-pointer w-fit transition w-full;
    }
  `,
})
export class ButtonComponent {
  badge = input<BadgeConfig>();
  icon = input<IconType>();
  disabled = input<boolean>();
  appearance = input<'transparent' | 'fill'>('fill');
  type = input<'button' | 'submit'>('button');
  inheritIconFillColor = input(false);
  size = input<Extract<Size, 'sm' | 'md' | 'lg' | 'xl'>>('md');

  componentClasses = computed(() =>
    [
      buttonSizeMap[this.size()],
      this.appearance() === 'fill' ? 'bg-gradient-primary' : '',
    ].join(' '),
  );
}
