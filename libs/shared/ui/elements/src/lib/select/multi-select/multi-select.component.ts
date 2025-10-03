import { coerceNumberProperty } from '@angular/cdk/coercion';
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
import { Dropdown } from '../../dropdown/dropdown.component';
import {
  DROPDOWN_CONFIG,
  DropdownConfig,
  DropdownSize,
} from '../../dropdown/model/dropdown-model';
import { FormControlWrapperComponent } from '../../form-control/form-control-wrapper.component';
import { IconComponent } from '../../icon/icon.component';
import { CustomListItemComponent } from '../../list-items';
import { TagComponent } from '../../tag/tag.component';
import { configCommonDropdownOverlay } from '../dropdown-overlay.util';

@Component({
  selector: 'lib-multi-select',
  templateUrl: './multi-select.component.html',
  imports: [FormControlWrapperComponent, IconComponent, NgClass, TagComponent],
  host: {
    class: 'inline-flex',
  },
  hostDirectives: [ConnectedOverlayDirective],
})
// export class MultiSelectComponent<T> extends FormControlComponent<ListItem<T>> implements OnInit {
export class MultiSelectComponent<T> implements OnInit {
  private readonly overlayDirectiveRef = inject(ConnectedOverlayDirective);
  private readonly injector = inject(Injector);

  private dropdownCompRef = signal<ComponentRef<Dropdown<T>> | undefined>(undefined);

  readonly listItemRenderComponent = input<Type<CustomListItemComponent<T>> | undefined>(
    undefined,
  );

  placeholder = input<string>('');
  dropdownSize = input<DropdownSize>('lg');
  dropdownTitle = input<string>('');
  dropdownHeight = input<number>();
  selectWidth = input<number>();
  confirmButtonLabel = input<string>('');
  cancelButtonLabel = input<string>('');
  _hasSelection = signal(false);
  hasSelection = linkedSignal(() => false);
  items = input.required<ListItem<T>[]>();
  icon = input<IconType>();
  appearance = input<'default' | 'minimal'>('default');
  size = input<Extract<Size, 'sm' | 'lg'>>('lg');
  tagLabel = input('');
  hint = input('');
  selectedCount = input(0, { transform: coerceNumberProperty });
  // TBD this is a temporary patch. _value needs to come from extending FormControlComponent<T>
  _value = linkedSignal(() => this.items()[0]);
  selectionModel = new SelectionModel<ListItem<T>>(
    true,
    [],
    true,
    (o1, o2) => o1.id === o2.id,
  );
  //   filterFn = input<DropdownFilterFn>(undefined);

  //   badgeConfig = computed<BadgeConfig>(() => ({
  //     type: 'counter',
  //     size: 'md',
  //     counterValue:
  //       this.dropdownCompRef()?.instance.selectedCount() ?? this.items().filter((i) => i.checkboxConfig?.checked).length,
  //   }));

  confirm = output<ListItem<T>[]>();

  providers = computed<Provider[]>(() => [
    {
      provide: DROPDOWN_CONFIG,
      useValue: {
        options: this.items(),
        type: 'multi',
        dropdownSize: this.dropdownSize(),
        maxDropdownHeight: this.dropdownHeight(),
        cancelButtonLabel: this.cancelButtonLabel() ?? 'Cancel',
        confirmButtonLabel: this.confirmButtonLabel() ?? 'Confirm',
        title: this.dropdownTitle(),
        selectionModel: this.selectionModel,
        listItemRenderComponent: this.listItemRenderComponent(),
      } as DropdownConfig<T>,
    },
  ]);

  constructor() {
    effect(() => useOverlayComponentPortal(Dropdown, this.providers(), this.injector));
    configCommonDropdownOverlay(this.overlayDirectiveRef);
    effect(() => {
      const dropdownRef = this.dropdownCompRef();
      if (dropdownRef) {
        dropdownRef.instance.confirmClicked.subscribe((v) => {
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
}
