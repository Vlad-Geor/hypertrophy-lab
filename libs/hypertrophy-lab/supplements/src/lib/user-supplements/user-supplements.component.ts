import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CarouselComponent } from '@ikigaidev/carousel';
import { GlobalOverlayDirective } from '@ikigaidev/directive';
import { ButtonComponent, IconComponent, TagComponent } from '@ikigaidev/elements';
import { Supplement } from '@ikigaidev/hl/model';
import { API_BASE_URL } from '@ikigaidev/hl/shared';
import { categories } from '@ikigaidev/mock';
import { AddSupplementComponent } from '../add-supplement/add-supplement.component';
import { SupplementCardComponent } from '../supplement-card/supplement-card.component';

@Component({
  selector: 'hl-user-supplements',
  imports: [
    CommonModule,
    SupplementCardComponent,
    TagComponent,
    IconComponent,
    CarouselComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './user-supplements.component.html',
  styleUrl: './user-supplements.component.scss',
  host: {
    style: 'display:inline-flex; flex-direction: column',
  },
  providers: [GlobalOverlayDirective],
})
export class SupplementListComponent {
  private readonly globalOverlay = inject(GlobalOverlayDirective);
  private readonly API_BASE = inject(API_BASE_URL);

  supplements = httpResource<Supplement[]>(`${this.API_BASE}/supplements`);

  categories = categories;

  addSupp(): void {
    this.globalOverlay.open(AddSupplementComponent, [], {});
  }
}
