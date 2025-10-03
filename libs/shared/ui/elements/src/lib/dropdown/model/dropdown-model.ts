import { SelectionModel } from '@angular/cdk/collections';
import { InjectionToken, Type } from '@angular/core';
import { ListItem, Size } from '@ikigaidev/model';
import { CustomListItemComponent } from '../../list-items';

export const DROPDOWN_CONFIG = new InjectionToken<DropdownConfig<any>>('DROPDOWN_DATA');

export type DropdownType = 'single' | 'multi';

export const DROPDOWN_TITLE = new InjectionToken<string>('DROPDOWN_TITLE');

export type DropdownSize = Extract<Size, 'sm' | 'lg'>;

export type DropdownConfig<T = undefined> = {
  options: ListItem<T>[];
  selectionModel: SelectionModel<ListItem<T>>;
  listItemRenderComponent?: Type<CustomListItemComponent<T>>;
  disableHover?: boolean;
  selectedCell?: ListItem<T>;
  type?: DropdownType;
  dropdownSize?: DropdownSize;
  title?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
};
