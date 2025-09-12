import { CommonModule } from '@angular/common';
import { Component, inject, input, linkedSignal, output } from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CellConfig } from '../select/select.component';
import { ListItemComponent } from './list-item.component';

@Component({
  selector: 'lib-list-items',
  template: `
    @if (options()?.length) {
      @for (option of _options(); track $index) {
        <lib-list-item
          [selected]="selectedItem() === option"
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
  private readonly dropdownRef = inject(DropdownComponent);

  options = input.required<CellConfig[]>();
  _options = linkedSignal(() => this.options());
  selectable = input(true);
  selectedItem = linkedSignal<CellConfig | null>(
    () => this.options().find((o) => o.selected) ?? null,
  );

  itemSelected = output<CellConfig>();

  selectItem(c: CellConfig): void {
    this._options.update((ops) => ops.map((o) => ({ ...o, selected: o === c })));
    this.selectedItem.set(c);
    this.dropdownRef.selectedItem.set(c);
  }
}
