import { CommonModule } from '@angular/common';
import { Component, input, output, Signal } from '@angular/core';
import { CellConfig } from '@ikigaidev/model';
import { ListItemComponent } from './list-item.component';

@Component({
  selector: 'lib-list-items',
  template: `
    @if (options().length) {
      @for (option of options(); track $index) {
        <lib-list-item
          [selected]="selectedItem()?.()?.id === option.id"
          [config]="option"
          [selectable]="selectable()"
        ></lib-list-item>
      }
    }
  `,
  host: {
    class: '@apply flex flex-col gap-2 p-2',
  },
  imports: [CommonModule, ListItemComponent],
})
export class ListItemsComponent {
  options = input.required<CellConfig[]>();
  selectable = input(true);
  selectedItem = input<Signal<CellConfig> | null>(null);

  itemSelected = output<CellConfig>();

  onItemSelected(c: CellConfig): void {
    this.itemSelected.emit(c);
  }
}
