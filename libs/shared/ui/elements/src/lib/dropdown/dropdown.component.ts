import { NgClass } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { CellConfig } from '@ikigaidev/model';
import { ButtonComponent } from '../button/button.component';
import { ListItemsComponent } from '../list-items/list-items.component';
import { DROPDOWN_CONFIG } from './model/dropdown-model';

@Component({
  selector: 'lib-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  imports: [NgClass, ButtonComponent, ListItemsComponent],
})
export class Dropdown {
  config = inject(DROPDOWN_CONFIG, { optional: true });

  hasSelection = signal(false);
  signalFallback = signal([]);
  itemSelected = output<CellConfig>();

  onItemSelected(cell: CellConfig): void {
    this.itemSelected.emit(cell);
  }

  toggleSelectAll(): void {
    throw Error('not implemented');
  }

  onClose(): void {
    throw Error('not implemented');
  }

  onConfirmClick(): void {
    throw Error('not implemented');
  }
}
