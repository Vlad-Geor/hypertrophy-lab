import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { IconComponent } from '@ikigaidev/elements';
import { Size } from '@ikigaidev/model';
import { PaginatorPageButtonComponent } from './page-button/page-button.component';

@Component({
  selector: 'lib-paginator',
  imports: [CommonModule, IconComponent, PaginatorPageButtonComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  page = input<number>();
  totalPages = input.required<number, string>({ transform: coerceNumberProperty });
  visibleRange = input<number>();
  disabled = input<boolean>();
  size = input<Extract<Size, 'sm' | 'md'>>();

  activePage = linkedSignal<number>(() => this.page() ?? 1);
  atFirstPage = computed(() => this.activePage() === 1);
  atLastPage = computed(() => this.activePage() === this.totalPages());

  _paginatorButtonCount = computed(() =>
    Array.from(
      { length: this.visibleRange() ?? this.totalPages() ?? 0 },
      (_, i) => i + 1,
    ),
  );

  pageChange = output<number>();

  previousPage(): void {
    if (!this.atFirstPage()) {
      this.activePage.update((p) => p - 1);
    }
  }
  nextPage(): void {
    if (!this.atLastPage()) {
      this.activePage.update((p) => p + 1);
    }
  }
}
