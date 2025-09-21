import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  Injector,
  OnInit,
  Provider,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CellConfig, IconType, Size } from '@ikigaidev/model';
import { ConnectedOverlayDirective, useOverlayComponentPortal } from '@ikigaidev/overlay';
import { DropdownV2 } from '../dropdown/dropdown-v2.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DROPDOWN_CONFIG } from '../dropdown/model/dropdown-model';
import { FormControlComponent } from '../form-control/form-control.component';
import { IconComponent } from '../icon/icon.component';
import { TagComponent } from '../tag/tag.component';
import { configCommonDropdownOverlay } from './dropdown-overlay.util';

type DropdownSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lib-select',
  imports: [CommonModule, ReactiveFormsModule, IconComponent, TagComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  hostDirectives: [ConnectedOverlayDirective],
})
export class SelectComponent extends FormControlComponent<CellConfig> implements OnInit {
  private readonly injector = inject(Injector);
  private readonly overlayDirectiveRef = inject(ConnectedOverlayDirective);
  private readonly dropdownCompRef = signal<ComponentRef<DropdownComponent> | undefined>(
    undefined,
  );

  readonly options = input<CellConfig[]>([]);
  readonly _options = linkedSignal(() => this.options());

  icon = input<IconType>();
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('md');
  tagLabel = input('');
  hint = input('');
  selectedCount = input(0, { transform: coerceNumberProperty });
  // open = input(false, { transform: coerceBooleanProperty });

  // _open = linkedSignal(() => this.open());

  override writeValue(value: CellConfig | null): void {
    if (value) {
      this._value.set(value);
    }
  }

  override registerOnChange(fn: (value?: CellConfig | null) => void): void {
    this.onChange = fn;
  }

  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  // toggleDropdown(): void {
  // if (this.disabled()) {
  // return;
  // }
  // this._open.set(!this._open());
  // }

  providers = computed<Provider[]>(() => [
    {
      provide: DROPDOWN_CONFIG,
      useValue: {
        type: 'single',
        dropdownSize: this.size(),
        options: this._options(),
        selectedCell: this._value(),
      },
    },
  ]);
  _hasSelection = signal(false);
  hasSelection = linkedSignal(() => !!this._value());
  selectionChange = output<CellConfig>();

  constructor() {
    super();
    effect(() => {
      useOverlayComponentPortal(DropdownV2, this.providers(), this.injector);
      configCommonDropdownOverlay(this.overlayDirectiveRef);
    });
    // effect(() => {
    //   const cmp = this.dropdownCompRef();
    //   if (cmp && cmp.instance.selectedItem()) {
    //     this._value.set(cmp.instance.selectedItem());
    //     this._options.update((opts) =>
    //       opts.map((op) => ({ ...op, selected: op === cmp.instance.selectedItem() })),
    //     );
    //     this.selectionChange.emit(cmp.instance.selectedItem() ?? ({} as CellConfig));
    //   }
    // });
  }

  ngOnInit(): void {
    this.overlayDirectiveRef?.componentAttached?.subscribe((cmp) => {
      this.dropdownCompRef.set(cmp);
    });
  }
}
