import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CellConfig } from '@ikigaidev/model';
import { ButtonComponent } from '../button/button.component';
import { ListItemsComponent } from '../list-items/list-items.component';
import { DROPDOWN_CONFIG } from './model/dropdown-model';

@Component({
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  imports: [NgClass, ButtonComponent, ListItemsComponent],
})
export class DropdownComponent {
  // Current usage of component is programmatic.
  // Incase manual, selector based usage is needed, inputs and html must be updated.
  config = inject(DROPDOWN_CONFIG, { optional: true });

  hasSelection = signal(false);
  initialValue = signal<CellConfig | undefined>(undefined);
  selectedItem = signal<CellConfig | undefined>(undefined);

  onItemSelected(cell: CellConfig): void {
    if (!this.initialValue()) this.initialValue.set(cell);
    this.selectedItem.set(cell);
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
