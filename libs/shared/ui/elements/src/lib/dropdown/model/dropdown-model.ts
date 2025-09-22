import { InjectionToken, Signal } from '@angular/core';
import { CellConfig, Size } from '@ikigaidev/model';

export const DROPDOWN_CONFIG = new InjectionToken<DropdownConfig>('DROPDOWN_DATA');

export type DropdownType = 'single' | 'multi';

export const DROPDOWN_TITLE = new InjectionToken<string>('DROPDOWN_TITLE');

export type DropdownSize = Extract<Size, 'sm' | 'md' | 'lg' | 'xl'>;

export type DropdownConfig = {
  options: CellConfig[];
  disableHover?: boolean;
  selectedCell?: Signal<CellConfig>;
  type?: DropdownType;
  dropdownSize?: DropdownSize;
  title?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
};
