import { httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API, API_BASE_URL, DashboardSummaryResponse } from '@ikigaidev/hl/shared';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly API_URL = inject(API_BASE_URL);

  dashboardAggregateWithinDays = signal<number>(30);
  dashboardDetails = httpResource<DashboardSummaryResponse>(
    () =>
      `${this.API_URL}${API.dashboard}/summary?withinDays=${this.dashboardAggregateWithinDays()}`,
  );
}
