import { Component, computed, input } from '@angular/core';
import { IconType, Size } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-icon-tile',
  template: `
    <lib-icon class="text-primary" [iconSize]="20" [icon]="icon()"></lib-icon>
  `,
  imports: [IconComponent],
  host: {
    class: 'flex items-center justify-center rounded-md bg-primary-soft',
    '[class]': 'cmpClasses()',
  },
})
export class IconTile {
  icon = input.required<IconType>();
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('md');

  cmpClasses = computed(() =>
    this.size() === 'sm' ? 'w-6 h-6' : this.size() === 'md' ? 'w-10 h-10' : 'w-16 h-16',
  );
}
