import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { IconType, Size, Theme } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-icon-tile',
  template: `
    <lib-icon
      [ngClass]="{
        'text-token': theme() !== 'gradient-primary',
        'text-white': theme().startsWith('gradient'),
      }"
      class="text-token"
      [iconSize]="20"
      [icon]="icon()"
    ></lib-icon>
  `,
  imports: [IconComponent, CommonModule],
  host: {
    class: 'flex items-center justify-center rounded-md bg-token-soft',
    '[class]': 'cmpClasses()',
    '[attr.data-tone]': 'theme()',
  },
})
export class IconTile {
  icon = input.required<IconType>();
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('md');
  theme = input<Theme>('primary');

  cmpClasses = computed(() =>
    this.size() === 'sm' ? 'w-6 h-6' : this.size() === 'md' ? 'w-10 h-10' : 'w-16 h-16',
  );
}
