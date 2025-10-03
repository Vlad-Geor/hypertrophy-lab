import { computed, Directive, effect, inject, Injector, input, Provider } from '@angular/core';
import { OVERLAY_HOST_DEFAULTS, useOverlayComponentPortal } from '@ikigaidev/overlay';
import { DROPDOWN_CONFIG, DropdownSize } from './model/dropdown-model';
import { Dropdown } from './dropdown.component';

@Directive({
  selector: '[libDropdown]',
  hostDirectives: [OVERLAY_HOST_DEFAULTS],
})
export class DropdownDirective <T>{
  private readonly injector = inject(Injector);

  libDropdown = input<T[]>();
  dropdownSize = input<DropdownSize>();
  providersConfig = computed<Provider[]>(() => [
    {
      provide: DROPDOWN_CONFIG,
      useValue: {
        data: this.libDropdown(),
        disableHover: true,
        dropdownSize: this.dropdownSize(),
      },
    },
  ]);

  constructor() {
    effect(() => {
      useOverlayComponentPortal(Dropdown, this.providersConfig(), this.injector);
    });
  }
}