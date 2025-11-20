import { coerceNumberProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  Injector,
  OnInit,
  Provider,
  Type,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IconType, ListItem, Size } from '@ikigaidev/model';
import { ConnectedOverlayDirective, useOverlayComponentPortal } from '@ikigaidev/overlay';
import { v5 as uuidv5 } from 'uuid';
import { Dropdown } from '../../dropdown/dropdown.component';
import { DROPDOWN_CONFIG, DropdownConfig } from '../../dropdown/model/dropdown-model';
import { FormControlWrapperComponent } from '../../form-control/form-control-wrapper.component';
import { FormControlComponent } from '../../form-control/form-control.component';
import { IconComponent } from '../../icon/icon.component';
import { CustomListItemComponent } from '../../list-items';
import { TagComponent } from '../../tag/tag.component';
import { configCommonDropdownOverlay } from '../dropdown-overlay.util';

export const NAMESPACE = '2b2f9e1a-1d1d-4e88-9c5a-9a5b4c9f2c11';

export function stableCellId(key: string) {
  return uuidv5(key, NAMESPACE);
}

@Component({
  selector: 'lib-single-select',
  imports: [
    CommonModule,
    IconComponent,
    ReactiveFormsModule,
    TagComponent,
    FormControlWrapperComponent,
  ],
  templateUrl: './single-select.component.html',
  hostDirectives: [ConnectedOverlayDirective],
  host: {
    '[attr.tabindex]': '0',
    class: 'w-full',
  },
})
export class SingleSelectComponent<V, T>
  extends FormControlComponent<V>
  implements OnInit
{
  private readonly injector = inject(Injector);
  private readonly overlayDirectiveRef = inject(ConnectedOverlayDirective);
  private readonly dropdownCompRef = signal<ComponentRef<Dropdown<V, T>> | undefined>(
    undefined,
  );

  private readonly selectionModel = new SelectionModel<ListItem<V, T>>(
    false,
    [],
    true,
    (o1, o2) => o1.id === o2.id,
  );

  readonly options = input<ListItem<V, T>[]>([]);
  readonly _options = linkedSignal(() =>
    this.options().map((opt) => ({
      ...opt,
      id: stableCellId(`${opt.displayText}|${opt.data}`),
    })),
  );

  readonly returnFn = input<(it: ListItem<V, T>) => V | undefined>(
    (it) => it.value ?? undefined,
  );
  readonly equals = input<(a: V, b: V) => boolean>((a, b) => a === b);
  readonly listItemRenderComponent = input<
    Type<CustomListItemComponent<V, T>> | undefined
  >(undefined);
  icon = input<IconType>();
  appearance = input<'default' | 'minimal'>('default');
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('lg');
  tagLabel = input('');
  hint = input('');
  selectedCount = input(0, { transform: coerceNumberProperty });

  selectionChange = output<V>();

  public readonly _item = signal<ListItem<V, T> | undefined>(undefined);
  // private readonly _valueToItem = computed(() => {
  //   const map = new Map<V, ListItem<V>>();
  //   for (const it of this.options() ?? []) map.set(this.returnFn()(it), it);
  //   return map;
  // });

  providers = computed<Provider[]>(() => [
    {
      provide: DROPDOWN_CONFIG,
      useValue: {
        type: 'single',
        dropdownSize: this.size(),
        options: this._options(),
        selectedCell: this._item(),
        selectionModel: this.selectionModel,
        listItemRenderComponent: this.listItemRenderComponent(),
      } as DropdownConfig<V, T>,
    },
  ]);

  override writeValue(value: V | null): void {
    if (value == null) {
      this._item.set(undefined);
      this._value.set(value ?? undefined);
      this.selectionModel.clear();
      return;
    }
    const found = false;
    if (found) {
      this._item.set(found);
      this.selectionModel.select(found);
    } else {
      this._item.set(undefined);
      this.selectionModel.clear();
    }
  }

  override registerOnChange(fn: (value?: V | null) => void): void {
    this.onChange = fn;
  }

  override registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  override setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  constructor() {
    super();
    effect(() => {
      useOverlayComponentPortal(Dropdown, this.providers(), this.injector);
      configCommonDropdownOverlay(this.overlayDirectiveRef);
    });

    this.selectionModel.changed.subscribe((chg) => {
      const added = chg.added?.[0];
      if (!added) return;
      this._item.set(added);
      const v = this.returnFn()(added);
      this.onChange(v);
      if (v) this.selectionChange.emit(v);
      this.overlayDirectiveRef.close();
    });
    // effect(() => {
    //   const cmp = this.dropdownCompRef();
    //   if (cmp) {
    //     this.selectionModel.changed.subscribe((change) => {
    //       const added = change.added?.[0];
    //       if (!added) return;
    //       this._item.set(added);
    //       const v = this.returnFn()(added);
    //       this.onChange(v);
    //       this._value.set(change.added.length ? change.added[0] : undefined);
    //       this.selectionChange.emit(added);
    //       this.overlayDirectiveRef.close();
    //     });
    //   }
    // });
    effect(() => {
      const it = this._item();
      if (!it) return;
      const exists = (this._options() ?? []).some((o) => o.id === it.id);
      if (!exists) {
        this._item.set(undefined);
        this.selectionModel.clear();
        this.onChange(null);
      }
    });
  }

  ngOnInit(): void {
    this.overlayDirectiveRef?.componentAttached?.subscribe((cmp) => {
      this.dropdownCompRef.set(cmp);
    });
  }
}
