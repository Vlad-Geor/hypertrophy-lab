import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@ikigaidev/config';
import { CloudinaryService, CloudinaryUploadRes } from '@ikigaidev/data-access';
import {
  ButtonComponent,
  DatePickerComponent,
  DividerComponent,
  IconButtonComponent,
  IconComponent,
  InputComponent,
  MultiSelectComponent,
  SingleSelectComponent,
  SlideToggleComponent,
} from '@ikigaidev/elements';
import { quantityUnits, Supplement } from '@ikigaidev/hl/model';
import { ListItem } from '@ikigaidev/model';
import { GLOBAL_OVERLAY_REF, GlobalOverlayRef } from '@ikigaidev/overlay';
import { toSlug } from '@ikigaidev/util';
import { filter, map, switchMap } from 'rxjs';
import { SupplementService } from '../data-access/supplement.service';
import {
  AddedSupplementCard,
  AddedSupplementItem,
} from './added-supplement-item/added-supplement-item.component';
import { AddedSupplementsOverview } from './added-supplements-overview/added-supplements-overview.component';
import {
  ExistingSuppItemData,
  ExistingSupplementItem,
} from './existing-supplement-item/existing-supplement-item.component';

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
  ],
  host: {
    class:
      'max-w-[400px] md:max-w-md bg-surface p-3 pl-4 flex flex-col gap-4 rounded-2xl border border-gray-active shadow-2xl',
  },
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

  existingSuppComponent = ExistingSupplementItem;
  supplementData = this.supplementService.allSupplements();
  options = toSignal(
    toObservable(this.supplementData.value).pipe(
      filter(Boolean),
      map(
        (response) =>
          response?.items.map((d) => ({
            data: {
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

  quantityUnits = quantityUnits;

  imageFormData = signal<FormData | undefined>(undefined);
  previewUrl = signal<string>('');
  selectedSupplements = signal<ListItem<ExistingSuppItemData>[]>([]);
  selectedSupplementsData = computed<AddedSupplementCard[]>(() => {
    const selected = this.selectedSupplements();
    return selected.map((s) => {
      if (s) {
        const { images, name, form, unitsPerContainer, servingUnits } = s.data;
        return {
          ...s,
          id: s.id ?? '',
          images: images,
          name: name,
          bottleCount: 0,
          daysLeft: 0,
          form: form,
          servingUnits: servingUnits,
          unitsPerContainer: unitsPerContainer,
        };
      } else {
        return {} as AddedSupplementCard;
      }
    });
  });

  readonly form = this.fb.nonNullable.group<
    Supplement & {
      date: Date;
      reminders: boolean;
      lowStockAlerts: boolean;
      existingItems: ListItem<ExistingSuppItemData>[];
      selectedSingleItem: ListItem<any> | undefined;
    }
  >({
    name: '',
    date: new Date(),
    description: '',
    servingSize: undefined,
    quantityUnit: undefined,
    dosageForm: undefined,
    healthTargets: undefined,
    imgUrl: undefined,
    itemCount: 0,
    reminders: false,
    lowStockAlerts: false,
    existingItems: [],
    selectedSingleItem: undefined,
  });

  constructor() {
    this.destroyRef.onDestroy(() => URL.revokeObjectURL(this.previewUrl()));
    this.form.valueChanges.subscribe((state) => {
      this.selectedSupplements.set(
        Array.isArray(state.existingItems) ? state.existingItems : [],
      );

      if (state.imgUrl && state.name) {
        this.imageFormData.update((fd) => {
          fd?.append('public_id', `supplements/${toSlug(state.name ?? '')}`);
          fd?.append('filename_override', `${toSlug(state.name ?? '')}`); // what you want to see in UI
          return fd;
        });
      }
    });
  }

  onSubmit(): void {
    const imgData = this.imageFormData();
    if (imgData) {
      this.cnService
        .uploadImage(imgData, environment.cloudinary.cloudName)
        .pipe(
          switchMap((cloudinaryRes: CloudinaryUploadRes) => {
            this.form.patchValue({ imgUrl: cloudinaryRes.secure_url });
            const v = this.form.getRawValue();

            return this.supplementService.addCatalogSupplement({
              itemCount: v.itemCount ?? 0,
              name: v.name,
              description: v.description ?? '',
              dosageForm: v.dosageForm,
              healthTargets: v.healthTargets,
              imgUrl: v.imgUrl,
              quantityUnit: v.quantityUnit,
              servingSize: v.servingSize,
            });
          }),
        )
        .subscribe();
    }
  }

  onFileInput(ev: Event) {
    const file = (ev.target as HTMLInputElement).files![0];
    if (!file) return;
    this.previewUrl.set(URL.createObjectURL(file));
    this.handleFile(file);
  }

  private async handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', environment.cloudinary.uploadPreset);
    form.append('folder', environment.cloudinary.uploadFolder + '/supplements');
    this.imageFormData.set(form);
  }

  onClose(): void {
    if (this.globalOverlayRef) this.globalOverlayRef.close();
  }
}
