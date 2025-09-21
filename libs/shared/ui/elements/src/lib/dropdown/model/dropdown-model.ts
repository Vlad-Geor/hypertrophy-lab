import { InjectionToken } from '@angular/core';
import { CellConfig, Size } from '@ikigaidev/model';

export const DROPDOWN_CONFIG = new InjectionToken<DropdownConfig<unknown>>(
  'DROPDOWN_DATA',
);

export type DropdownType = 'single' | 'multi';

export const DROPDOWN_TITLE = new InjectionToken<string>('DROPDOWN_TITLE');

export type DropdownSize = Extract<Size, 'sm' | 'md' | 'lg' | 'xl'>;

export type DropdownConfig<T> = {
  options: CellConfig[];
  disableHover?: boolean;
  selectedCell?: T;
  type?: DropdownType;
  dropdownSize?: DropdownSize;
  title?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
};
