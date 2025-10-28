import { NgClass } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ListItem } from '@ikigaidev/model';
import { debounceTime } from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';
import { InputComponent } from '../input/input.component';
import { ListItemsComponent } from '../list-items/list-items.component';
import { DROPDOWN_CONFIG, DropdownConfig } from './model/dropdown-model';

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
    ReactiveFormsModule,
  ],
})
export class Dropdown<V, T> {
  config = inject<DropdownConfig<V, T>>(DROPDOWN_CONFIG, { optional: true });
  _options = signal(this.config?.options);
  configSm = this.config?.selectionModel;

  hasSelection = signal(false);
  signalFallback = signal([]);

  itemSelected = output<ListItem<V, T>>();
  confirmClicked = output<V[]>();
  cancelClicked = output<void>();

  filterInput = new FormControl<string>('');

  constructor() {
    this.filterInput.valueChanges.pipe(debounceTime(200)).subscribe((v) =>
      this._options.set(
        this.config?.options?.filter((op) => {
          return op.displayText.includes(v ?? '');
        }),
      ),
    );
    this.hasSelection.set(this.config?.selectionModel.hasValue() ?? false);

    this.configSm?.changed.subscribe(() =>
      this.hasSelection.set(this.configSm?.hasValue() ?? false),
    );
    if (this.config?.selectedCell) {
      this.configSm?.select(this.config.selectedCell);
    }
  }

  onItemSelected(cell: ListItem<V, T>): void {
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
    console.log('selected: ', this.configSm?.selected);

    // this.confirmClicked.emit(
    //   this.configSm?.selected?.map((s) => s.value ?? ({} as V)) ?? [],
    // );
  }
}
