import { SelectionModel } from '@angular/cdk/collections';
import { InjectionToken, Type } from '@angular/core';
import { ListItem, Size } from '@ikigaidev/model';
import { CustomListItemComponent } from '../../list-items';

export const DROPDOWN_CONFIG = new InjectionToken<DropdownConfig<any, any>>('DROPDOWN_DATA');

export type DropdownType = 'single' | 'multi';

export const DROPDOWN_TITLE = new InjectionToken<string>('DROPDOWN_TITLE');

export type DropdownSize = Extract<Size, 'sm' | 'md' | 'lg'>;

export type DropdownConfig<V = unknown, T = undefined> = {
  options: ListItem<V, T>[];
  selectionModel: SelectionModel<ListItem<V, T>>;
  listItemRenderComponent?: Type<CustomListItemComponent<V, T>>;
  disableHover?: boolean;
  selectedCell?: ListItem<V, T>;
  type?: DropdownType;
  dropdownSize?: DropdownSize;
  title?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
};
