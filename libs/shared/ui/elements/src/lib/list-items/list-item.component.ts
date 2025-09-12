import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CellConfig } from '../select/select.component';
import { ListItemsComponent } from './list-items.component';

@Component({
  selector: 'lib-list-item',
  template: `
    @if (config()?.icon) {
      <lib-icon
        class="[&:hover:not(.disabled)]:bg-red-500"
        [iconSize]="12"
        [icon]="config()?.icon"
      ></lib-icon>
    }
    {{ config()?.displayText }}
  `,
  imports: [CommonModule, IconComponent],
  host: {
    class: 'flex items-center gap-2 py-2 px-3 rounded',
    '[class]': 'classes()',
    '[class.selected]': 'config()?.selected',
    '[attr.tabindex]': '0',
    '(click)': 'onSelfClick()',
  },
})
export class ListItemComponent {
  private readonly ListItemsRef = inject(ListItemsComponent);

  config = input<CellConfig>();
  selectable = input(true);
  selected = input(false);

  computedClasses = computed(() => {
    const selectableClasses = this.selectable()
      ? ['hover:cursor-pointer', '[&:hover:not(.selected)]:bg-surface-2']
      : [''];
    const selectedClasses = this.config()?.selected
      ? ['bg-primary-subtle', 'text-primary']
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
        this.ListItemsRef.selectItem(c);
      }
    }
  }
}
