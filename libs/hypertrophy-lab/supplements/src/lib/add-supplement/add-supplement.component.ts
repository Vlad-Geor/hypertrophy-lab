import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '@ikigaidev/config';
import { CloudinaryService } from '@ikigaidev/data-access';
import {
  ButtonComponent,
  IconComponent,
  InputComponent,
  SelectComponent,
} from '@ikigaidev/elements';
import { HealthTarget, Supplement, quantityUnits } from '@ikigaidev/hl/model';
import { HEALTH_TARGETS } from '@ikigaidev/model';

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

  HealthTargets = HEALTH_TARGETS;
  quantityUnits = quantityUnits;
  healthTargetKeys = Object.keys(this.HealthTargets) as HealthTarget[];

  addedImageUrl = signal('');
  supplementImage = signal<FormData | undefined>(undefined);

  readonly form = this.fb.group<Supplement & { itemCount?: number }>({
    name: '',
    description: '',
    itemCount: undefined,
    servingSize: undefined,
    quantityUnit: undefined,
    dosageForm: undefined,
    healthTarget: undefined,
    img: '',
  });

  constructor() {
    this.form.valueChanges.subscribe((change) => {
      if (change.img) {
        // this.supplementImage.update((fd) => ({ ...fd }));
        // .this.chosenImage.append('public_id', `supplements/${slug}`);
      }
    });
  }

  onSubmit(): void {
    const rawFormData = this.form.getRawValue();
    console.log(rawFormData);

    this.http.post<Supplement[]>('/api/v1/supplement', rawFormData).subscribe();
    if (this.supplementImage()) {
      // this.cnService
      // .uploadImage(this.supplementImage(), environment.CLOUD_NAME)
      // .subscribe(console.log);
    }
  }

  onFileInput(ev: Event) {
    const file = (ev.target as HTMLInputElement).files![0];
    console.log(file);
    if (file) {
      this.handleFiles(file);
    }
  }

  private async handleFiles(file: File) {
    if (!file.type.startsWith('image/')) return;
    const compressed = await this.downsizeImage(file);
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', environment.UPLOAD_PRESET);
    form.append('folder', environment.UPLOAD_FOLDER);
    form.append('overwrite', 'true');
    this.supplementImage.set(form);
  }

  private async downsizeImage(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file);

    const MAX = 1080; // long‑edge target (Instagram grid standard)
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, w, h);

    // WebP has ~25‑30% better compression than JPEG at same perceptual quality
    return canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });
  }
}
