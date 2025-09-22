import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { CellConfig } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';
import { ListItemsComponent } from './list-items.component';

@Component({
  selector: 'lib-list-item',
  template: `
    <div class="flex gap-3">
      @if (config()?.icon) {
        <lib-icon [iconSize]="12" [icon]="config()?.icon"></lib-icon>
      }
      <span>{{ config()?.displayText }}</span>
    </div>
    @if (selected()) {
      <lib-icon [iconSize]="12" [icon]="'check-solid'"></lib-icon>
    }
  `,
  imports: [CommonModule, IconComponent],
  host: {
    class: 'flex items-center justify-between gap-2 py-2 px-3 rounded',
    '[class]': 'classes()',
    '[class.selected]': 'selected()',
    '[attr.tabindex]': '0',
    '(click)': 'onSelfClick()',
  },
  styles: `
    :host {
      &.selected {
        @apply bg-surface-2;
      }
    }
  `,
})
export class ListItemComponent {
  private readonly listItemsRef = inject(ListItemsComponent);

  config = input<CellConfig>();
  selectable = input(true);
  selected = input(false);

  computedClasses = computed(() => {
    const selectableClasses = this.selectable()
      ? ['hover:cursor-pointer', '[&:hover:not(.selected)]:bg-gray-hover']
      : [''];
    const selectedClasses = this.selected()
      ? ['bg-secondary-subtle', 'text-secondary']
      : [''];

    return selectableClasses.concat(selectedClasses);
  });

  classes = computed(() => {
    return this.computedClasses().join(' ');
  });

  onSelfClick(): void {
    if (this.selectable()) {
      const c = this.config();
      if (c) {
        this.listItemsRef.onItemSelected(c);
      }
    }
  }
}
