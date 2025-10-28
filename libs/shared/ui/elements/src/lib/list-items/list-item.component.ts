import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { ListItem, Size } from '@ikigaidev/model';
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
    <!-- @if (selected()) {
      <lib-icon
        class="text-secondary"
        [fillContainer]="true"
        [iconSize]="12"
        [icon]="'check-solid'"
      ></lib-icon>
    } -->
  `,
  imports: [CommonModule, IconComponent],
  host: {
    class: 'flex items-center justify-between rounded',
    '[class]': 'computedClasses()',
    '[class.selected]': 'selected()',
    '[attr.tabindex]': '0',
    '(click)': 'onSelfClick()',
  },
  styles: `
    :host {
      &.selected {
        @apply bg-primary-ghost;
      }
    }
  `,
})
export class ListItemComponent<V, T> {
  private readonly listItemsRef = inject(ListItemsComponent);

  config = input<ListItem<V, T>>();
  selectable = input(true);
  selected = input(false);
  size = input<Extract<Size, 'sm' | 'lg'>>('lg');

  computedClasses = computed(() => {
    const selectableClasses = this.selectable()
      ? ['hover:cursor-pointer', '[&:hover:not(.selected)]:bg-gray-hover']
      : [''];
    const selectedClasses = this.selected() ? ['bg-secondary-subtle'] : [''];
    const sizeClasses =
      this.size() === 'sm'
        ? ['text-sm', 'gap-1', 'py-1.5', 'px-2']
        : ['gap-2', 'py-2', 'px-3'];

    return [...selectableClasses, ...selectedClasses, ...sizeClasses].join(' ');
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
