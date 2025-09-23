import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HealthTargetCarouselComponent } from '@ikigaidev/carousel';
import {
  ButtonComponent,
  IconComponent,
  StatefulIconComponent,
  TagComponent,
  TagGroupComponent,
} from '@ikigaidev/elements';
import { categories } from '@ikigaidev/hl/mock';
import { Supplement } from '@ikigaidev/hl/model';
import { API_BASE_URL, ListCatalogResponse } from '@ikigaidev/hl/shared';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { AddSupplementComponent } from '../../add-supplement/add-supplement.component';
import { SupplementCardComponent } from '../../supplement-card/supplement-card.component';
import { PaginatedDataResponse } from '../all-supplements/all-supplements.component';

@Component({
  selector: 'hl-user-supplements',
  imports: [
    CommonModule,
    SupplementCardComponent,
    TagComponent,
    IconComponent,
    StatefulIconComponent,
    HealthTargetCarouselComponent,
    ReactiveFormsModule,
    ButtonComponent,
    TagGroupComponent,
  ],
  templateUrl: './user-supplements.component.html',
  styleUrl: './user-supplements.component.scss',
})
export class SupplementList {
  private readonly globalOverlay = inject(GlobalOverlay);
  private readonly API_BASE = inject(API_BASE_URL);

  supplements = httpResource<ListCatalogResponse>(
    () => `${this.API_BASE}/supplements`,
  );

  constructor() {
    effect(() => console.log(this.supplements.value()));
  }

  categories = categories;

  addSupp(): void {
    this.globalOverlay.openComponent(AddSupplementComponent, {});
  }
}
