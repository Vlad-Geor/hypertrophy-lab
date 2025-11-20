import { SelectionModel } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  inputBinding,
  output,
  outputBinding,
  QueryList,
  Type,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NoData } from '@ikigaidev/hl/shared';
import { ListItem, Size } from '@ikigaidev/model';
import { filter, startWith } from 'rxjs';
import { IconComponent } from '../icon/icon.component';
import { ListItemComponent } from './list-item.component';
import { CustomListItemComponent } from './model/custom-list-item.model';

@Component({
  selector: 'lib-list-items',
  template: `
    @if (options().length) {
      <cdk-virtual-scroll-viewport
        [itemSize]="itemHeight()"
        class="scrollbar-thin scrollbar-theme flex flex-col gap-2"
        [style.min-height.px]="menuHeight()"
        [ngClass]="{
          'max-w-[20ch]': size() === 'sm',
          'max-w-[28ch]': size() === 'md',
          'max-w-[36ch]': size() === 'lg',
        }"
      >
        <div class="flex items-center gap-1.5" *cdkVirtualFor="let option of options()">
          @if (selectionModel().isSelected(option)) {
            <div class="flex">
              <lib-icon
                [icon]="'check-circle-broken-liner'"
                class="text-success-bright"
              ></lib-icon>
            </div>
          } @else if (selectionModel().isMultipleSelection()) {
            <div
              class="h-5 w-5 px-1 flex items-center justify-center bg-gray-subtle rounded"
            >
              <div class="w-full h-0.5 bg-gray-text rounded-full"></div>
            </div>
          }

          @if (customListItemComponent()) {
            <ng-container #dynamicComponentContainer class="flex-1"></ng-container>
          } @else {
            <lib-list-item
              class="flex-1"
              [size]="this.size()"
              [selected]="selectionModel().isSelected(option)"
              [config]="option"
              [selectable]="selectable()"
            ></lib-list-item>
          }
        </div>
      </cdk-virtual-scroll-viewport>
    } @else if (!options().length) {
      <hl-no-data
        noDataTitle="No Results"
        noDataMessage="Dropdown contains no items."
        size="md"
        type="no-data"
      ></hl-no-data>
    } @else {
      <hl-no-data size="md" type="filter"></hl-no-data>
    }
  `,
  host: {
    class: 'flex flex-col p-2',
  },
  imports: [
    CommonModule,
    ListItemComponent,
    CdkVirtualScrollViewport,
    ScrollingModule,
    IconComponent,
    NoData,
  ],
})
export class ListItemsComponent<V, T> implements AfterViewInit {
  private readonly dRef = inject(DestroyRef);

  @ViewChildren('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicContainers!: QueryList<ViewContainerRef>;

  options = input.required<ListItem<V, T>[]>();
  selectable = input(true);
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('lg');
  customListItemComponent = input<Type<CustomListItemComponent<V, T>>>();

  selectionModel = input.required<SelectionModel<ListItem<V, T>>>();

  itemSelected = output<ListItem<V, T>>();

  itemHeight = computed(() =>
    this.size() === 'sm' ? 32 : this.size() === 'md' ? 40 : 48,
  );
  menuHeight = computed(
    () => Math.min(this.options().length * this.itemHeight() + 20, 440), //  16px for padding-block
  );

  constructor() {
    effect(() => {
      if (this.options()?.length && this.dynamicContainers?.length) {
        this.createDynamicComponents();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dynamicContainers.changes
      .pipe(
        startWith(this.dynamicContainers),
        filter((containers) => !!containers.length),
        takeUntilDestroyed(this.dRef),
      )
      .subscribe(() => this.createDynamicComponents());
  }

  onItemSelected(c: ListItem<V, T>): void {
    this.itemSelected.emit(c);
  }

  private createDynamicComponents(): void {
    const customComponent = this.customListItemComponent();
    if (!customComponent || !this.dynamicContainers) return;

    this.dynamicContainers.forEach((container, index) => {
      const ref = container;

      ref.clear();

      const listItem = this.options()[index];
      const componentRef = ref.createComponent(customComponent, {
        bindings: [
          inputBinding('data', () => listItem.data),
          inputBinding('listItem', () => listItem),
          inputBinding('selected', () => this.selectionModel().isSelected(listItem)),
          inputBinding('size', () => this.size()),
          outputBinding('itemClicked', () => this.onItemSelected(listItem)),
        ],
      });
    });
  }
}
