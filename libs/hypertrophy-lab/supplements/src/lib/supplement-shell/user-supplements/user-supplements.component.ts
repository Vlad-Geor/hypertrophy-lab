import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BouncingLoaderComponent } from '@ikigaidev/elements';
import { categories } from '@ikigaidev/hl/mock';
import { GlobalOverlay } from '@ikigaidev/overlay';
import { CreateSupplementComponent } from '../../create-supplement/create-supplement.component';
import { SupplementStore } from '../../data-access/supplement.store';
import { SupplementCardComponent } from '../../supplement-card/supplement-card.component';
import { AddSupplementToInventory } from '../../add-to-inventory/add-to-inventory.component';
import { ErrorPage } from '@ikigaidev/hl/shared';

@Component({
  selector: 'hl-user-supplements',
  imports: [
    CommonModule,
    SupplementCardComponent,
    ReactiveFormsModule,
    BouncingLoaderComponent,
    ErrorPage
  ],
  templateUrl: './user-supplements.component.html',
  styleUrl: './user-supplements.component.scss',
})
export class SupplementList {
  private readonly globalOverlay = inject(GlobalOverlay);
  // private readonly supplementService = inject(SupplementService);
  readonly store = inject(SupplementStore);

  categories = categories;

  // supplements = this.supplementService.userSupplements;

  addSupp(): void {
    this.globalOverlay.openComponent(AddSupplementToInventory, {});
  }
}
