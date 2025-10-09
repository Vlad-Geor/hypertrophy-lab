import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CloudinaryService } from '@ikigaidev/data-access';
import {
  BouncingLoaderComponent,
  ButtonComponent,
  DatePickerComponent,
  DividerComponent,
  generateUnitOptions,
  IconButtonComponent,
  IconComponent,
  InputComponent,
  MultiSelectComponent,
  SingleSelectComponent,
  SlideToggleComponent,
} from '@ikigaidev/elements';
import {
  AddInventoryBulkExistingRequest,
  BulkExistingItem,
} from '@ikigaidev/hl/contracts';
import { ListItem } from '@ikigaidev/model';
import { GLOBAL_OVERLAY_REF, GlobalOverlayRef } from '@ikigaidev/overlay';
import { filter, map } from 'rxjs';
import { SupplementService } from '../data-access/supplement.service';
import {
  AddedSupplementCard,
  AddedSupplementItem,
  SupplementStockChangeEvent,
} from './added-supplement-item/added-supplement-item.component';
import { AddedSupplementsOverview } from './added-supplements-overview/added-supplements-overview.component';
import {
  ExistingSuppItemData,
  ExistingSupplementItem,
} from './existing-supplement-dropdown-item/existing-supplement-item.component';

@Component({
  selector: 'hl-add-to-inventory',
  templateUrl: './add-to-inventory.component.html',
  providers: [CloudinaryService, SupplementService],
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    IconComponent,
    InputComponent,
    IconButtonComponent,
    DatePickerComponent,
    SingleSelectComponent,
    MultiSelectComponent,
    SlideToggleComponent,
    CommonModule,
    DividerComponent,
    ExistingSupplementItem,
    AddedSupplementItem,
    AddedSupplementsOverview,
    BouncingLoaderComponent,
  ],
  host: {
    class:
      'max-w-[400px] md:max-w-md bg-surface p-3 pl-4 flex flex-col gap-4 rounded-2xl border border-gray-active shadow-2xl',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSupplementToInventory {
  mode = signal<'create' | 'add-existing' | undefined>('add-existing');

  private readonly fb = inject(FormBuilder);
  private readonly cnService = inject(CloudinaryService);
  readonly supplementService = inject(SupplementService);
  private readonly destroyRef = inject(DestroyRef);
  protected globalOverlayRef = inject<GlobalOverlayRef>(GLOBAL_OVERLAY_REF, {
    optional: true,
  });

  unitOptions = signal(generateUnitOptions(60));
  existingSuppComponent = ExistingSupplementItem;
  supplementData = this.supplementService.allSupplements();
  options = toSignal(
    toObservable(this.supplementData.value).pipe(
      filter(Boolean),
      map(
        (response) =>
          response?.items.map((d) => ({
            data: {
              id: d.id,
              images: d.images,
              name: d.name,
              form: d.form,
              servingUnits: Number(d.servingUnits),
              unitsPerContainer: d.unitsPerContainer,
            },
            displayText: d.name,
          })) as ListItem<ExistingSuppItemData>[] | undefined,
      ),
    ),
  );

  imageFormData = signal<FormData | undefined>(undefined);
  previewUrl = signal<string>('');
  previewSupplements = signal<ListItem<ExistingSuppItemData>[]>([]);

  selectedCatalog = linkedSignal<{
    id: string;
    name: string;
    totalUnits?: number;
  } | null>(() => {
    const firstIndexItem = this.selectedSupplementsData()?.[0];
    if (firstIndexItem) {
      return {
        id: firstIndexItem.id ?? null,
        name: firstIndexItem?.name,
        totalUnits:
          (firstIndexItem.unitsPerContainer ?? 0) * (firstIndexItem.bottleCount ?? 0),
      };
    }
    return null;
  });

  selectedIndex = computed(() => {
    const selectedCatalog = this.selectedCatalog();
    if (!selectedCatalog?.id) return -1;
    return this.items?.controls?.findIndex(
      (g) => g.controls?.catalogId?.value === selectedCatalog.id,
    );
  });

  selectedGroup = computed(() => {
    const i = this.selectedIndex();
    return i >= 0 ? this.items.at(i) : null;
  });

  cardState = signal<Record<string, { bottleCount: number }>>({});

  selectedSupplementsData = linkedSignal<AddedSupplementCard[]>(() => {
    const base = this.previewSupplements(); // read-only selection from multiselect
    const st = this.cardState();
    const mapped = base.map((s) => {
      const { id, images, name, form, unitsPerContainer, servingUnits } = s.data;
      const b = st[id]?.bottleCount ?? 1;
      return {
        ...s,
        id,
        images,
        name,
        form,
        servingUnits,
        unitsPerContainer,
        bottleCount: b,
        daysLeft: (b * (unitsPerContainer ?? 0)) / Number(servingUnits),
      };
    });
    console.log(mapped);

    return mapped;
  });

  readonly form = this.fb.group({
    items: this.fb.nonNullable.array<ReturnType<typeof this.createItemForm>>([]),
  });
  readonly existingItemsDropdown = this.fb.nonNullable.control<
    ListItem<ExistingSuppItemData>[]
  >([]);

  get items() {
    return this.form.controls.items;
  }

  onStockChanged(change: SupplementStockChangeEvent): void {
    console.log('change event: ', change);

    this.cardState.update((cs) => {
      const res = { ...cs };
      res[change.catalogId] = { bottleCount: change.newStock };
      return res;
    });
    // previewSupps.map(s => ({...s, }))
  }

  constructor() {
    // 1. Multi dropdown input is passed into previewSupps.
    // multi dropdown input
    this.existingItemsDropdown.valueChanges.subscribe((state) => {
      if (Array.isArray(state)) {
        this.previewSupplements.set(state);
      }
    });
    effect(() => {
      const previewSupps = this.previewSupplements();
      previewSupps.forEach((s) => this.ensureItem(s.data.id));
      this.items.controls.forEach((c) => c.valueChanges.subscribe(console.log));
    });

    // if (state.imgUrl && state.name) {
    //   this.imageFormData.update((fd) => {
    //     fd?.append('public_id', `supplements/${toSlug(state.name ?? '')}`);
    //     fd?.append('filename_override', `${toSlug(state.name ?? '')}`); // what you want to see in UI
    //     return fd;
    //   });
    // }
    // this.destroyRef.onDestroy(() => URL.revokeObjectURL(this.previewUrl()));
  }

  createItemForm(catalogId: string, init: Partial<BulkExistingItem> = {}) {
    return this.fb.nonNullable.group({
      catalogId: this.fb.nonNullable.control(catalogId),

      lowStockThresholdUnits: this.fb.nonNullable.control(
        init?.lowStockThresholdUnits ?? 20,
      ),

      quantityUnits: this.fb.nonNullable.control(init?.initialBatch?.quantityUnits ?? 20),

      settings: this.fb.nonNullable.group({
        lowStockAlertsEnabled: this.fb.nonNullable.control(
          init?.settings?.lowStockAlertsEnabled ?? true,
        ),
        intakeRemindersEnabled: this.fb.nonNullable.control(
          init?.settings?.intakeRemindersEnabled ?? false,
        ),
      }),
    });
  }

  ensureItem(catalogId: string, init?: Partial<BulkExistingItem>) {
    let i = this.items.controls.findIndex(
      (g) => g.controls.catalogId.value === catalogId,
    );
    if (i === -1) {
      this.items.push(this.createItemForm(catalogId, init));
      i = this.items.length - 1;
    }
  }

  onSupplementOverviewSelect(selected: AddedSupplementCard): void {
    if (selected.id)
      this.selectedCatalog.set({
        id: selected.id,
        name: selected.name,
        totalUnits: selected.bottleCount * (selected.unitsPerContainer ?? 0),
      });
  }

  onSubmit(): void {
    const selectedByCatalogId = new Map(
      this.selectedSupplementsData().map((s) => [
        s.id,
        (s.bottleCount ?? 0) * (s.unitsPerContainer ?? 0),
      ]),
    );
    const formatted = this.items.value.map(
      ({ catalogId, lowStockThresholdUnits, quantityUnits, settings }) => {
        const extra = selectedByCatalogId.get(catalogId ?? '') ?? 0;
        return {
          catalogId,
          lowStockThresholdUnits,
          initialBatch: {
            quantityUnits: (quantityUnits ?? 0) + extra,
          },
          settings,
        } as BulkExistingItem;
      },
    );
    console.log('formatted: ', formatted);
    const req: AddInventoryBulkExistingRequest = { items: formatted };
    this.supplementService.addExistingSupplementsToUserBulk(req).subscribe();
    // const imgData = this.imageFormData();
    // if (imgData) {
    //   this.cnService
    //     .uploadImage(imgData, environment.cloudinary.cloudName)
    //     .pipe(
    //       switchMap((cloudinaryRes: CloudinaryUploadRes) => {
    //         this.form.patchValue({ imgUrl: cloudinaryRes.secure_url });
    //         const v = this.form.getRawValue();
    //         return this.supplementService.addCatalogSupplement({
    //           itemCount: v.itemCount ?? 0,
    //           name: v.name,
    //           description: v.description ?? '',
    //           dosageForm: v.dosageForm,
    //           healthTargets: v.healthTargets,
    //           imgUrl: v.imgUrl,
    //           quantityUnit: v.quantityUnit,
    //           servingSize: v.servingSize,
    //         });
    //       }),
    //     )
    //     .subscribe();
    // }
  }

  // onFileInput(ev: Event) {
  //   const file = (ev.target as HTMLInputElement).files![0];
  //   if (!file) return;
  //   this.previewUrl.set(URL.createObjectURL(file));
  //   this.handleFile(file);
  // }

  // private async handleFile(file: File) {
  //   if (!file.type.startsWith('image/')) return;
  //   const form = new FormData();
  //   form.append('file', file);
  //   form.append('upload_preset', environment.cloudinary.uploadPreset);
  //   form.append('folder', environment.cloudinary.uploadFolder + '/supplements');
  //   this.imageFormData.set(form);
  // }

  onClose(): void {
    if (this.globalOverlayRef) this.globalOverlayRef.close();
  }
}
