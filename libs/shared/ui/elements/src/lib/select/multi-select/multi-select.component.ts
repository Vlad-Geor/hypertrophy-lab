import { SelectionModel } from '@angular/cdk/collections';
import { NgClass } from '@angular/common';
import {
  Component,
  ComponentRef,
  computed,
  effect,
  inject,
  Injector,
  input,
  linkedSignal,
  OnInit,
  output,
  Provider,
  signal,
  Type,
} from '@angular/core';
import { IconType, ListItem, Size } from '@ikigaidev/model';
import { ConnectedOverlayDirective, useOverlayComponentPortal } from '@ikigaidev/overlay';
import { IconButtonComponent } from '../../button/icon-button/icon-button.component';
import { Dropdown } from '../../dropdown/dropdown.component';
import { DROPDOWN_CONFIG, DropdownConfig } from '../../dropdown/model/dropdown-model';
import { FormControlWrapperComponent } from '../../form-control/form-control-wrapper.component';
import { FormControlComponent } from '../../form-control/form-control.component';
import { IconComponent } from '../../icon/icon.component';
import { CustomListItemComponent } from '../../list-items';
import { TagComponent } from '../../tag/tag.component';
import { configCommonDropdownOverlay } from '../dropdown-overlay.util';
import { stableCellId } from '../single-select/single-select.component';

@Component({
  selector: 'lib-multi-select',
  templateUrl: './multi-select.component.html',
  imports: [
    FormControlWrapperComponent,
    IconComponent,
    NgClass,
    TagComponent,
    IconButtonComponent,
  ],
  host: {
    class: 'inline-flex',
  },
  hostDirectives: [ConnectedOverlayDirective],
})
export class MultiSelectComponent<V, T>
  extends FormControlComponent<V[]>
  implements OnInit
{
  private readonly overlayDirectiveRef = inject(ConnectedOverlayDirective);
  private readonly injector = inject(Injector);

  private dropdownCompRef = signal<ComponentRef<Dropdown<V, T>> | undefined>(undefined);

  readonly listItemRenderComponent = input<
    Type<CustomListItemComponent<V, T>> | undefined
  >(undefined);

  dropdownTitle = input<string>('');
  dropdownHeight = input<number>();
  selectWidth = input<number>();
  confirmButtonLabel = input<string>('');
  cancelButtonLabel = input<string>('');
  items = input.required<ListItem<V, T>[]>();
  icon = input<IconType>();
  appearance = input<'default' | 'minimal'>('default');
  size = input<Extract<Size, 'sm' | 'lg'>>('lg');
  tagLabel = input('');
  hint = input('');
  selectedCount = computed(() => this._value()?.length);
  selectionModel = new SelectionModel<ListItem<V, T>>(
    true,
    [],
    true,
    (o1, o2) => o1.id === o2.id,
  );
  readonly _options = linkedSignal(() =>
    this.items().map((opt) => ({
      ...opt,
      id: stableCellId(`${opt.displayText}|${opt.data}`),
    })),
  );
  displayValue = computed<unknown | undefined>(() => this._value() ?? undefined);

  confirm = output<V[]>();

  providers = computed<Provider[]>(() => [
    {
      provide: DROPDOWN_CONFIG,
      useValue: {
        options: this._options(),
        type: 'multi',
        dropdownSize: this.size(),
        maxDropdownHeight: this.dropdownHeight(),
        cancelButtonLabel: this.cancelButtonLabel() ?? 'Cancel',
        confirmButtonLabel: this.confirmButtonLabel() ?? 'Confirm',
        title: this.dropdownTitle(),
        selectionModel: this.selectionModel,
        listItemRenderComponent: this.listItemRenderComponent(),
      } as DropdownConfig<V, T>,
    },
  ]);

  override writeValue(value: V[] | undefined): void {
    if (value) {
      if (value.length) {
        this._value.set(value);
      } else this._value.set(undefined);
    }
  }
  override registerOnChange(fn: (value?: V[] | null | undefined) => void): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  //   filterFn = input<DropdownFilterFn>(undefined);

  //   badgeConfig = computed<BadgeConfig>(() => ({
  //     type: 'counter',
  //     size: 'md',
  //     counterValue:
  //       this.dropdownCompRef()?.instance.selectedCount() ?? this.items().filter((i) => i.checkboxConfig?.checked).length,
  //   }));

  constructor() {
    super();
    effect(() => useOverlayComponentPortal(Dropdown, this.providers(), this.injector));
    configCommonDropdownOverlay(this.overlayDirectiveRef);
    effect(() => {
      const dropdownRef = this.dropdownCompRef();
      if (dropdownRef) {
        dropdownRef.instance.confirmClicked.subscribe((v) => {
          this.onChange(v);
          this.confirm.emit(v);
          this.overlayDirectiveRef.close();
        });
        dropdownRef.instance.cancelClicked.subscribe(() => {
          this.selectionModel.clear();
          this.overlayDirectiveRef.close();
        });
      }
    });
  }

  ngOnInit(): void {
    this.overlayDirectiveRef?.componentAttached?.subscribe((cmp) => {
      this.dropdownCompRef.set(cmp);
    });
  }

  onClear(): void {
    this.onChange([]);
    this.selectionModel.clear();
  }
}
