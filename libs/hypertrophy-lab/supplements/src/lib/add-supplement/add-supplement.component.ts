import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '@ikigaidev/config';
import { CloudinaryService, CloudinaryUploadRes } from '@ikigaidev/data-access';
import { GlobalOverlayDirective } from '@ikigaidev/directive';
import {
  ButtonComponent,
  IconComponent,
  InputComponent,
  SelectComponent,
} from '@ikigaidev/elements';
import { HealthTarget, Supplement, quantityUnits } from '@ikigaidev/hl/model';
import { HEALTH_TARGETS } from '@ikigaidev/model';
import { toSlug } from '@ikigaidev/util';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'hl-add-supplement',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectComponent,
    InputComponent,
    ButtonComponent,
    MatSelectModule,
    IconComponent,
  ],
  templateUrl: './add-supplement.component.html',
  styleUrl: './add-supplement.component.scss',
  providers: [CloudinaryService],
})
export class AddSupplementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly cnService = inject(CloudinaryService);
  private readonly overlay = inject(GlobalOverlayDirective);
  private readonly destroyRef = inject(DestroyRef);

  HealthTargets = HEALTH_TARGETS;
  quantityUnits = quantityUnits;
  healthTargetKeys = Object.keys(this.HealthTargets) as HealthTarget[];

  imageFormData = signal<FormData | undefined>(undefined);
  previewUrl = signal<string>('');

  readonly form = this.fb.group<Supplement & { stockQuantity?: number }>({
    name: '',
    description: '',
    stockQuantity: undefined,
    servingSize: undefined,
    quantityUnit: undefined,
    dosageForm: undefined,
    healthTargets: undefined,
    imgUrl: undefined,
    packageQuantity: 0,
  });

  constructor() {
    effect(() => console.log(this.imageFormData()));
    this.destroyRef.onDestroy(() => URL.revokeObjectURL(this.previewUrl()));
    this.form.valueChanges.subscribe((state) => {
      console.log(state);

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
          tap(console.log),
          switchMap((cloudinaryRes: CloudinaryUploadRes) => {
            this.form.patchValue({ imgUrl: cloudinaryRes.secure_url });
            return this.http.post<Supplement>(
              'http://localhost:3333/api/v1/users/1/supplements',
              this.form.getRawValue(),
            );
          }),
        )
        .subscribe(console.log);
    }
  }

  onFileInput(ev: Event) {
    const file = (ev.target as HTMLInputElement).files![0];
    console.log(file);
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

  onDiscard(): void {
    this.overlay.close();
  }
}
