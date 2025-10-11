import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '@ikigaidev/config';
import { CloudinaryService, CloudinaryUploadRes } from '@ikigaidev/data-access';
import {
  ButtonComponent,
  Checkbox,
  DatePickerComponent,
  IconButtonComponent,
  IconComponent,
  InputComponent,
  SingleSelectComponent,
  SlideToggleComponent,
} from '@ikigaidev/elements';
import { Supplement, quantityUnits } from '@ikigaidev/hl/model';
import { GLOBAL_OVERLAY_REF, GlobalOverlayRef } from '@ikigaidev/overlay';
import { toSlug } from '@ikigaidev/util';
import { switchMap } from 'rxjs';
import { SupplementService } from '../data-access/supplement.service';

@Component({
  selector: 'hl-add-supplement',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    Checkbox,
    MatNativeDateModule,
    InputComponent,
    ButtonComponent,
    MatSelectModule,
    IconComponent,
    IconButtonComponent,
    DatePickerComponent,
    SingleSelectComponent,
    SlideToggleComponent,
  ],
  templateUrl: './create-supplement.component.html',
  styleUrl: './create-supplement.component.scss',
  providers: [CloudinaryService, SupplementService],
})
export class CreateSupplementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cnService = inject(CloudinaryService);
  private readonly supplementService = inject(SupplementService);
  private readonly destroyRef = inject(DestroyRef);
  protected globalOverlayRef = inject<GlobalOverlayRef>(GLOBAL_OVERLAY_REF, {
    optional: true,
  });

  // HealthTargets = HEALTH_TARGETS;
  quantityUnits = quantityUnits;
  // healthTargetKeys = Object.keys(this.HealthTargets) as HealthTarget[];

  imageFormData = signal<FormData | undefined>(undefined);
  previewUrl = signal<string>('');

  readonly form = this.fb.nonNullable.group<
    Supplement & { date: Date; reminders: boolean }
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
  });

  constructor() {
    this.destroyRef.onDestroy(() => URL.revokeObjectURL(this.previewUrl()));
    this.form.valueChanges.subscribe((state) => {
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
