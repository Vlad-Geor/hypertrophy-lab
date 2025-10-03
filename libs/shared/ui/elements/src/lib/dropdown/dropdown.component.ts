import { NgClass } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { ListItem } from '@ikigaidev/model';
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';
import { InputComponent } from '../input/input.component';
import { ListItemsComponent } from '../list-items/list-items.component';
import { DROPDOWN_CONFIG } from './model/dropdown-model';

@Component({
  selector: 'lib-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  imports: [
    NgClass,
    ButtonComponent,
    ListItemsComponent,
    InputComponent,
    DividerComponent,
  ],
})
export class Dropdown<T> {
  config = inject(DROPDOWN_CONFIG, { optional: true });
  configSm = this.config?.selectionModel;

  hasSelection = signal(false);
  signalFallback = signal([]);

  itemSelected = output<ListItem<T>>();
  confirmClicked = output<ListItem<T>[]>();
  cancelClicked = output<void>();

  constructor() {
    console.log(this.config);

    this.configSm?.changed.subscribe(() =>
      this.hasSelection.set(this.configSm?.hasValue() ?? false),
    );
    if (this.config?.selectedCell) {
      this.configSm?.select(this.config.selectedCell);
    }
  }

  onItemSelected(cell: ListItem<T>): void {
    if (this.config?.type === 'single') {
      this.config.selectionModel.select(cell);
      this.itemSelected.emit(cell);
    } else if (this.config?.type === 'multi') {
      this.configSm?.toggle(cell);
    }
  }

  toggleSelectAll(): void {
    if (this.config?.type === 'single') return;
    if (this.configSm?.hasValue()) {
      this.configSm.clear();
    } else {
      this.configSm?.select(...(this.config?.options ?? []));
    }
  }

  onClose(): void {
    this.cancelClicked.emit();
  }

  onConfirmClick(): void {
    this.confirmClicked.emit((this.configSm?.selected as ListItem<T>[]) ?? []);
  }
}
