import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { BadgeConfig, IconType, Size, Theme } from '@ikigaidev/model';

@Component({
  selector: 'lib-button',
  imports: [CommonModule],
  template: `
    <ng-content select="lib-icon[left]"></ng-content>

    <ng-content></ng-content>

    <ng-content select="lib-icon[right]"></ng-content>
  `,
  host: {
    class: `outline-0 border inline-flex justify-center items-center gap-2
     rounded hover:cursor-pointer transition-all
      duration-100`,
    '[attr.data-tone]': 'disabled() ? "gray" : theme()',
    '[attr.type]': '"button"',
    '[class]': 'allClasses()',
    '[class.disabled]': 'disabled()',
    '[class.rounded-full]': 'rounded()',
    '[class.w-full]': 'fillContainer()',
    '[class.w-fit]': '!fillContainer()',
  },
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  badge = input<BadgeConfig>();

  theme = input<Theme>('white');
  icon = input<IconType>();
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('md');
  appearance = input<'outline' | 'fill'>('fill');
  fillContainer = input<boolean>(false);
  rounded = input<boolean>(false);
  disabled = input<boolean>();

  themeClasses = computed(() =>
    (this.appearance() === 'fill'
      ? this.theme().includes('gradient')
        ? ['bg-gradient', 'border-0']
        : ['bg-token-soft', 'border-token-soft', 'hover:bg-token-active']
      : ['text-token', 'border-token-soft', 'hover:bg-token-ghost']
    )
      .concat('text-token')
      .join(' '),
  );

  allClasses = computed(() => {
    return [this.size(), this.appearance(), this.themeClasses()]
      .filter(Boolean)
      .join(' ');
  });
}
